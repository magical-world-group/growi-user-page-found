module.exports = (crowi, app) => {
  const express = require('express');
  const router = express.Router();

  router.get('/_api/contributions', async (req, res) => {
    const Page = crowi.model('Page');
    const Revision = crowi.model('Revision');
    const User = crowi.model('User');

    const pages = await Page.find({}).populate('revision').populate('creator');

    const userStats = {};

    pages.forEach(page => {
      if (!page.revision || !page.creator) return;

      const rawText = page.revision.body || '';
      const cleanText = rawText.replace(/[\s\W]/g, '');
      const charCount = cleanText.length;

      const userId = page.creator._id.toString();
      const username = page.creator.username;

      if (!userStats[userId]) {
        userStats[userId] = { username: username, count: 0 };
      }

      userStats[userId].count += charCount;
    });

    const result = Object.values(userStats).sort((a, b) => b.count - a.count);

    res.json({ contributors: result });
  });

  app.use('/user-contributions', router); // ← こっちが正解！
};
