import Project from '../../models/project';

export default function setProjectTimestamps(req, res) {
  const { startTimestamp, stopTimestamp } = req.body;
  const { project_id: projectId } = req.params;

  const timeSpent = {
    startTimestamp,
    stopTimestamp
  };

  return Project.findOneAndUpdate(
    { _id: projectId },
    { $push: { timeSpent } },
    { new: true, useFindAndModify: false }
  )
    .then((updatedProject) => {
      res.status(200).json(updatedProject);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    });
}
