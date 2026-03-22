import { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [resumeHTML, setResumeHTML] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLocally = (data) => {
    const { name, email, phone, summary, experience, education, skills } = data;
    return `
      <div class="resume-preview-content">
        <header>
          <h1 class="resume-name">${name || 'Jane Doe'}</h1>
          <p class="resume-contact">${email || 'jane@example.com'} | ${phone || '(555) 123-4567'}</p>
        </header>
        <section class="resume-section">
          <h2>Professional Summary</h2>
          <p>${summary || 'Resourceful professional with a knack for creating clean and efficient code.'}</p>
        </section>
        <section class="resume-section">
          <h2>Experience</h2>
          <div class="resume-item"><p>${(experience || 'Senior Developer at Tech Co. (2020 - Present)').replace(/\n/g, '<br/>')}</p></div>
        </section>
        <section class="resume-section">
          <h2>Education</h2>
          <div class="resume-item"><p>${(education || 'B.S. in Computer Science - University of Technology').replace(/\n/g, '<br/>')}</p></div>
        </section>
        <section class="resume-section">
          <h2>Skills</h2>
          <ul class="resume-skills-list">
            ${(skills || 'JavaScript, React, Node.js, CSS, HTML').split(',').map(s => `<li>${s.trim()}</li>`).join('')}
          </ul>
        </section>
      </div>
    `;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('http://localhost:3001/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.success) {
        setResumeHTML(data.resumeHTML);
      } else {
        setResumeHTML(generateLocally(formData));
      }
    } catch (err) {
      // Fallback: generate client-side when backend is not available (e.g. GitHub Pages)
      setResumeHTML(generateLocally(formData));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Resume Generator</h1>
        <p>Craft your perfect professional story in seconds with the power of AI.</p>
      </header>
      
      <main className="main-content">
        <section className="form-section glass-panel">
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Phone Number</label>
                <input type="tel" name="phone" className="form-control" placeholder="+1 (234) 567-8900" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Professional Summary</label>
              <textarea name="summary" className="form-control" placeholder="A brief overivew of your professional background and goals..." value={formData.summary} onChange={handleChange}></textarea>
            </div>

            <div className="form-group">
              <label>Work Experience</label>
              <textarea name="experience" className="form-control" placeholder="List your relevant work experience..." value={formData.experience} onChange={handleChange}></textarea>
            </div>

            <div className="form-group">
              <label>Education</label>
              <textarea name="education" className="form-control" placeholder="Your educational background..." value={formData.education} onChange={handleChange}></textarea>
            </div>

            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input type="text" name="skills" className="form-control" placeholder="JavaScript, React, Node.js, Project Management" value={formData.skills} onChange={handleChange} />
            </div>

            {error && <p style={{color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <><span className="loader"></span> Generating...</>
              ) : (
                '✨ Generate AI Resume'
              )}
            </button>
          </form>
        </section>

        <section className="preview-section glass-panel">
          {resumeHTML ? (
             <div dangerouslySetInnerHTML={{ __html: resumeHTML }} style={{height: '100%'}} />
          ) : (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>Your AI Resume Preview</h3>
              <p>Fill out the required information and click generate to see your beautifully formatted resume here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
