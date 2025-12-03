import React from 'react';
import Layout from '@theme/Layout';
import VideoEmbed from '@site/src/components/VideoEmbed';
import styles from './videos.module.css';

const videos = [
  {
    id: 'lvzMLf6wXlY',
    title: 'Kubernetes Native Distributed Inferencing',
    description: 'Introduction to llm-d at DevConf.US 2025 — learn the fundamentals of distributed LLM inference on Kubernetes.',
  },
  {
    id: 'mfXIe_S53vA',
    title: 'Serving PyTorch LLMs at Scale',
    description: 'Disaggregated inference with Kubernetes and llm-d — presented by M. Ayoub & C. Liu at PyTorch Conference.',
  },
  {
    id: '_xAXb70d4-0',
    title: 'Distributed Inference with Well-Lit Paths',
    description: 'Explore llm-d\'s "well-lit paths" approach to simplified, production-ready distributed inference.',
  },
  {
    id: 'g8_snJA_ESU',
    title: 'Multi-Accelerator LLM Inference',
    description: 'Deep dive into multi-accelerator LLM inference on Kubernetes — presented by Erwan Gallen at KubeCon.',
  },
];

function VideoCard({ video }) {
  return (
    <div className={styles.videoCard}>
      <div className={styles.videoWrapper}>
        <VideoEmbed videoId={video.id} responsive={true} />
      </div>
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description}</p>
      </div>
    </div>
  );
}

export default function Videos() {
  return (
    <Layout
      title="Videos"
      description="Watch videos about llm-d: a Kubernetes-native high-performance distributed LLM inference framework">
      <main className={styles.videosPage}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroIcon}>▶</span>
              Learn llm-d
            </h1>
            <p className={styles.heroSubtitle}>
              Explore our video collection to learn about llm-d's capabilities, 
              architecture, and best practices for deploying LLM inference at scale.
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to get started?</h2>
          <p className={styles.ctaText}>
            Dive into our documentation or join our community to learn more.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/docs/guide" className={styles.ctaButtonPrimary}>
              Read the Docs
            </a>
            <a href="/slack" className={styles.ctaButtonSecondary}>
              Join Slack
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}

