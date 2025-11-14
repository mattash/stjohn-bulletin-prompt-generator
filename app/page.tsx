'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [bulletinDateDisplay, setBulletinDateDisplay] = useState('');
  const [bulletinDateIso, setBulletinDateIso] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCopySuccess(false);

    try {
      // Filter out empty video URLs
      const filteredVideoUrls = videoUrls.filter(url => url.trim() !== '');

      const response = await fetch('/api/build-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bulletinDateDisplay,
          bulletinDateIso,
          videoUrls: filteredVideoUrls,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to build prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, '']);
  };

  const removeVideoUrl = (index: number) => {
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  const updateVideoUrl = (index: number, value: string) => {
    const newVideoUrls = [...videoUrls];
    newVideoUrls[index] = value;
    setVideoUrls(newVideoUrls);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>St. John Bulletin Generator</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="bulletinDateDisplay">
              Bulletin date (e.g. Sunday, November 17, 2024)
            </label>
            <input
              type="text"
              id="bulletinDateDisplay"
              value={bulletinDateDisplay}
              onChange={(e) => setBulletinDateDisplay(e.target.value)}
              required
              placeholder="Sunday, November 17, 2024"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bulletinDateIso">
              Bulletin date ISO (YYYY-MM-DD)
            </label>
            <input
              type="date"
              id="bulletinDateIso"
              value={bulletinDateIso}
              onChange={(e) => setBulletinDateIso(e.target.value)}
              required
            />
          </div>

          <div className={styles.videoSection}>
            <label className={styles.videoSectionLabel}>
              YouTube Video URLs (optional)
            </label>
            {videoUrls.map((url, index) => (
              <div key={index} className={styles.videoInputGroup}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateVideoUrl(index, e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={styles.videoInput}
                />
                {videoUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addVideoUrl}
              className={styles.addButton}
            >
              + Add Another Video URL
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Building prompt...' : 'Generate Prompt'}
          </button>
        </form>

        {generatedPrompt && (
          <div className={styles.resultSection}>
            <div className={styles.resultHeader}>
              <h2>Generated Prompt</h2>
              <button
                onClick={handleCopyToClipboard}
                className={styles.copyButton}
              >
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <textarea
              className={styles.promptTextarea}
              value={generatedPrompt}
              readOnly
              rows={30}
            />
          </div>
        )}
      </main>
    </div>
  );
}
