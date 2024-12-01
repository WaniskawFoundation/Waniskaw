import axios from 'axios';
import Q from 'q';
import mongoose from 'mongoose';
import objectID from 'bson-objectid';
import shortid from 'shortid';
import { defaultCSS, defaultHTML } from '../domain-objects/createDefaultFiles';
import User from '../models/user';
import Project from '../models/project';

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const headers = { 'User-Agent': 'p5js-web-editor/0.0.1' };
const mongoConnectionString = process.env.MONGO_URL;
const sketchURL =
  'https://api.github.com/repositories/760925693/contents/src/content/examples/en';

mongoose.connect(mongoConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', () => {
  console.error(
    'MongoDB Connection Error. Please make sure that MongoDB is running.'
  );
  process.exit(1);
});

async function createProjectsInP5user(projects) {
  const user = await User.findOne({ username: 'p5' }).exec();
  await Q.all(
    projects.map(async (project) => {
      let newProject;
      const a = objectID().toHexString();
      const b = objectID().toHexString();
      const c = objectID().toHexString();
      const r = objectID().toHexString();
      const noNumberprojectName = project.projectName.replace(/(\d+)/g, '');
      if (noNumberprojectName === 'Instance Mode: Instance Container ') {
        newProject = new Project({
          name: project.projectName,
          user: user._id.toString(),
          projectType: 'example_code',
          files: [
            {
              name: 'root',
              id: r,
              _id: r,
              children: [a, b, c],
              fileType: 'folder'
            },
            {
              name: 'sketch.js',
              content:
                '// Instance Mode: Instance Container, please check its index.html file',
              id: a,
              _id: a,
              fileType: 'file',
              children: []
            },
            {
              name: 'index.html',
              content: project.sketchContent,
              isSelectedFile: true,
              id: b,
              _id: b,
              fileType: 'file',
              children: []
            },
            {
              name: 'style.css',
              content: defaultCSS,
              id: c,
              _id: c,
              fileType: 'file',
              children: []
            }
          ],
          _id: shortid.generate()
        });
      } else {
        newProject = new Project({
          name: project.projectName,
          user: user._id,
          projectType: 'example_code',
          files: [
            {
              name: 'root',
              id: r,
              _id: r,
              children: [a, b, c],
              fileType: 'folder'
            },
            {
              name: 'sketch.js',
              content: project.sketchContent,
              id: a,
              _id: a,
              isSelectedFile: true,
              fileType: 'file',
              children: []
            },
            {
              name: 'index.html',
              content: defaultHTML,
              id: b,
              _id: b,
              fileType: 'file',
              children: []
            },
            {
              name: 'style.css',
              content: defaultCSS,
              id: c,
              _id: c,
              fileType: 'file',
              children: []
            }
          ],
          _id: shortid.generate()
        });
      }

      await newProject.save();
    })
  );

  process.exit();
}

function formatName(name) {
  let newName = name.replace(/^\d+_*/, '');
  newName = newName.replace(/_/g, ' ');

  return newName.endsWith('.js') ? newName.slice(0, -3).trim() : newName.trim();
}

function newCategoryFromName(category, name) {
  if (name !== 'More' && name !== 'code') {
    return category === '' ? name : category.concat(': ').concat(name);
  }
  return category;
}

async function getAllSketches(sketches, url, category = '') {
  // Define options to get data from the URL
  const options = {
    url,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`
    }
  };
  const response = await axios.request(options);

  // Use Promise.all with map for async iteration
  await Promise.all(
    response.data.map(async (item) => {
      if (!item.download_url) {
        // Recursively call getAllSketches for directories
        await getAllSketches(
          sketches,
          item.url.replace('?ref=main', ''),
          newCategoryFromName(category, formatName(item.name))
        );
      } else if (item.name.includes('.js')) {
        // Fetch the sketch data if it's a .js file
        const sketchOptions = {
          url: item.download_url.replace('?ref=main', ''),
          method: 'GET',
          headers: {
            ...headers
          }
        };
        let sketch = false;
        try {
          sketch = await axios.request(sketchOptions);
        } catch (e) {
          console.log('could not get sketch @: ', sketchOptions.url);
          console.log(e.message);
        }

        if (sketch) {
          sketches.push({
            projectName: newCategoryFromName(category, formatName(item.name)),
            sketchContent: sketch.data
          });
        }
      }
    })
  );
}

function sortProjectsByName(projects) {
  return projects.sort((a, b) => a.projectName.localeCompare(b.projectName));
}

async function getp5User() {
  // Get or create generic p5 user
  console.log('Getting p5 user');
  const user = await User.findOne({ username: 'p5' }).exec();
  let p5User = user;
  if (!p5User) {
    p5User = new User({
      username: 'p5',
      email: process.env.EXAMPLE_USER_EMAIL,
      password: process.env.EXAMPLE_USER_PASSWORD
    });
    await p5User.save();
    console.log(`Created a user p5 ${p5User}`);
  }

  // Clear old projects
  const projects = await Project.find({ user: p5User._id }).exec();
  console.log('Deleting old projects...');
  projects.forEach(async (project) => {
    await Project.deleteOne({ _id: project._id });
  });

  const sketches = [];
  await getAllSketches(sketches, sketchURL);
  sortProjectsByName(sketches);
  const projectsInUser = createProjectsInP5user(sketches);
  return projectsInUser;
}

getp5User();
