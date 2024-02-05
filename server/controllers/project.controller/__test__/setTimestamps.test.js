import mongoose from 'mongoose';
import express from 'express';
import setProjectTimestamps from '../setTimestamps';
import Project from '../../../models/project';

jest.mock('../../../models/Project');

const app = express();
app.use(express.json());
app.post('/setProjectTimestamps', setProjectTimestamps);

describe('setProjectTimestamps', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the project with the given timestamps', async () => {
    const startTimestamp = new Date();
    const stopTimestamp = new Date();

    const req = {
      params: {
        project_id: 'some_project_id'
      },
      body: {
        startTimestamp,
        stopTimestamp
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const updatedProject = {
      _id: req.params.project_id,
      timeSpent: [req.body]
    };

    jest
      .spyOn(Project, 'findOneAndUpdate')
      .mockImplementation(() => Promise.resolve(updatedProject));

    await setProjectTimestamps(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedProject);
    expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: req.params.project_id },
      { $push: { timeSpent: req.body } },
      { new: true, useFindAndModify: false }
    );
  });

  it('should return a 500 error if the database update fails', async () => {
    const startTimestamp = new Date();
    const stopTimestamp = new Date();

    const req = {
      params: {
        project_id: 'some_project_id'
      },
      body: {
        startTimestamp,
        stopTimestamp
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest
      .spyOn(Project, 'findOneAndUpdate')
      .mockImplementation(() => Promise.reject(new Error('Database error')));

    await setProjectTimestamps(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});
