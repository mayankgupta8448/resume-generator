const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate-resume', (req, res) => {
  const { name, email, phone, summary, experience, education, skills } = req.body;

  // Mocking an AI generation for the sake of the MVP
  const generatedResumeHTML = `
    <div class="resume-preview-content">
      <header>
        <h1 class="resume-name">${name || 'Jane Doe'}</h1>
        <p class="resume-contact">${email || 'jane@example.com'} | ${phone || '(555) 123-4567'}</p>
      </header>
      
      <section class="resume-section">
        <h2>Professional Summary</h2>
        <p>${summary || 'Resourceful professional with a knack for creating clean and efficient code. Proven ability to leverage modern technologies.'}</p>
      </section>

      <section class="resume-section">
        <h2>Experience</h2>
        <div class="resume-item">
          <p>${(experience || 'Senior Developer at Tech Co. (2020 - Present)\\n- Led frontend team\\n- Improved performance by 40%').replace(/\n/g, '<br/>')}</p>
        </div>
      </section>

      <section class="resume-section">
        <h2>Education</h2>
        <div class="resume-item">
          <p>${(education || 'B.S. in Computer Science - University of Technology').replace(/\n/g, '<br/>')}</p>
        </div>
      </section>

      <section class="resume-section">
        <h2>Skills</h2>
        <ul class="resume-skills-list">
          ${(skills || 'JavaScript, React, Node.js, CSS, HTML').split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}
        </ul>
      </section>
    </div>
  `;

  res.json({ success: true, resumeHTML: generatedResumeHTML });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
