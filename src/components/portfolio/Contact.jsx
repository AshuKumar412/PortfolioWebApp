import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { contactService } from '../../services/contactService';
import { validateContactForm } from '../../utils/validators';
import { toast } from '../ui/Toast';
import { Button } from '../ui/Button';
import './Contact.css';

export function Contact({ profile }) {
  const ref = useScrollReveal();
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateContactForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await contactService.submit({ ...form, is_read: false });
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent! I\'ll get back to you soon.');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Let&apos;s Connect</span>
          <h2 className="section__title">Get In Touch</h2>
          <p className="section__subtitle">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="contact__grid reveal" ref={ref}>
          <div className="contact__info">
            <h3 className="contact__info-title">Contact Information</h3>
            <p className="contact__info-text">
              I&apos;m currently open to freelance work and full-time opportunities.
              Feel free to reach out if you have a project or position that fits my skills.
            </p>
            <div className="contact__details">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="contact__detail">
                  <span className="contact__detail-icon" aria-hidden="true">📧</span>
                  <span>{profile.email}</span>
                </a>
              )}
              {profile?.location && (
                <div className="contact__detail">
                  <span className="contact__detail-icon" aria-hidden="true">📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="contact__form-wrap">
            {sent ? (
              <div className="contact__success">
                <div className="contact__success-icon" aria-hidden="true">✓</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I&apos;ll respond within 24–48 hours.</p>
                <Button variant="secondary" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">
                      Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                    {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                    {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">
                    Subject <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className={`form-input ${errors.subject ? 'form-input--error' : ''}`}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                  {errors.subject && <span className="form-error" role="alert">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                    placeholder="Tell me about your project or idea..."
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                  {errors.message && <span className="form-error" role="alert">{errors.message}</span>}
                </div>

                <Button type="submit" size="lg" loading={loading} className="contact__submit">
                  Send Message →
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
