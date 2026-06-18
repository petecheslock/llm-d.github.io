---
title: Upcoming llm-d Events
description: Meet the llm-d community at upcoming talks, meetups, and conferences
sidebar_label: Upcoming llm-d Events
sidebar_position: 2
---

# Upcoming llm-d Events

Stay connected with the llm-d community at meetups, conferences, and workshops. All meetings are open to the public unless noted otherwise.

{(() => {
  const events = [
    {
      month: 'October 2026',
      title: 'PyTorch Conference North America',
      location: 'San Jose, CA',
      dateText: 'October 20–21, 2026',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/pytorch-conference-north-america/',
      sessions: [],
    },
    {
      month: 'November 2026',
      title: 'KubeCon + CloudNativeCon North America',
      location: 'Salt Lake City, Utah',
      dateText: 'November 9–12, 2026',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/',
      sessions: [],
    },
  ];

  const months = Array.from(new Set(events.map((e) => e.month)));

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px'
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '16px',
    border: '1px solid var(--ifm-color-emphasis-200)',
    borderRadius: '8px',
    backgroundColor: 'var(--ifm-background-surface-color)'
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: 'var(--ifm-color-primary)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 600
  };

  const sectionStyle = {
    marginBottom: '28px'
  };

  const headerRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '6px'
  };

  const titleRowLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  };

  return (
    <div>
      {months.map((m) => {
        const monthEvents = events.filter((e) => e.month === m);
        if (monthEvents.length === 0) return null;
        return (
          <div key={m} style={sectionStyle}>
            <h2>{m}</h2>
            <div style={containerStyle}>
              {monthEvents.map((e) => (
                <div key={e.title} style={{...cardStyle, flexDirection: 'column', alignItems: 'stretch'}}>
                  <div style={headerRowStyle}>
                    <div style={titleRowLeftStyle}>
                      <h4 style={{margin: 0, color: 'var(--ifm-color-primary)'}}>{e.title}</h4>
                    </div>
                    <a href={e.href} target="_blank" rel="noopener noreferrer" style={buttonStyle}>Register</a>
                  </div>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0 0 6px 0'}}>
                    <span style={{fontSize: '12px', padding: '2px 8px', backgroundColor: 'var(--ifm-color-emphasis-100)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '999px'}}>📍 {e.location}</span>
                  </div>
                  <p style={{margin: 0, fontSize: '14px'}}>{e.dateText} · <strong>{e.cost}</strong></p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
})()}
