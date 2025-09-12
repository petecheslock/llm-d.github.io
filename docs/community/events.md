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
      month: 'September 2025',
      title: 'PyTorch ATX: The Future of Inferencing',
      location: 'Austin, TX',
      dateText: 'Sep 17, 2025',
      cost: 'Free',
      href: 'https://www.meetup.com/pytorch-atx/events/307742180/',
    },
    {
      month: 'September 2025',
      title: 'Boston vLLM + llm-d Meetup',
      location: 'Boston, MA',
      dateText: 'Sep 18, 2025',
      cost: 'Free',
      href: 'https://luma.com/vjfelimw',
    },
    {
      month: 'September 2025',
      title: 'DevConf.US 2025',
      location: 'Boston, MA',
      dateText: 'Sep 19–20, 2025',
      cost: 'Free',
      href: 'https://www.devconf.info/us/',
    },
    {
      month: 'October 2025',
      title: 'PyTorch Conference 2025',
      location: 'San Francisco, CA',
      dateText: 'Oct 22–23, 2025',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/pytorch-conference/',
    },
    {
      month: 'November 2025',
      title: 'KubeCon + CloudNativeCon North America 2025',
      location: 'Atlanta, GA',
      dateText: 'Nov 10–13, 2025',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/',
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
                <div key={e.title} style={cardStyle}>
                  <div>
                    <h4 style={{margin: '0 0 6px 0', color: 'var(--ifm-color-primary)'}}>{e.title}</h4>
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '0 0 6px 0'}}>
                      <span style={{fontSize: '12px', padding: '2px 8px', backgroundColor: 'var(--ifm-color-emphasis-100)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '999px'}}>📍 {e.location}</span>
                    </div>
                    <p style={{margin: 0, fontSize: '14px'}}>{e.dateText} · <strong>{e.cost}</strong></p>
                  </div>
                  <a href={e.href} target="_blank" rel="noopener noreferrer" style={buttonStyle}>Register</a>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
})()}