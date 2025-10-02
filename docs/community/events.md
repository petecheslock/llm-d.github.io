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
      month: 'October 2025',
      title: 'IBM TechXchange 2025',
      location: 'Las Vegas, NV',
      dateText: 'Oct 6, 2025',
      cost: 'Paid',
      href: 'https://www.ibm.com/community/ibm-techxchange-conference/',
      sessions: [
        {
          title: 'Learn how LLM inference goes distributed with llm-d',
          date: 'Mon, Oct 6, 2025',
          time: '3:00pm – 3:30pm EDT',
          location: 'Lake Louise, Lobby Level, Hilton',
          href: 'https://reg.tools.ibm.com/flow/ibm/techxchange25/sessioncatalog/page/sessioncatalog/session/1756952044813001War5',
        },
      ],
    },
    {
      month: 'October 2025',
      title: 'All Things Open 2025',
      location: 'Raleigh, NC',
      dateText: 'Oct 12–14, 2025',
      cost: 'Paid',
      href: 'https://2025.allthingsopen.org/register',
      sessions: [
        {
          title: 'llm-d: Open Source Infrastructure for Cost-Efficient LLM Deployment at Scale',
          date: 'Oct 12–14, 2025',
          time: 'TBD',
          href: 'https://2025.allthingsopen.org/sessions/llm-d-open-source-infrastructure-for-cost-efficient-llm-deployment-at-scale',
        },
      ],
    },
    {
      month: 'October 2025',
      title: 'AMD AI Dev Day 2025',
      location: 'San Francisco, CA',
      dateText: 'Oct 20, 2025',
      cost: 'Free',
      href: 'https://www.amd.com/en/corporate/events/amd-ai-dev-day.html',
      sessions: [],
    },
    {
      month: 'October 2025',
      title: 'PyTorch Conference 2025',
      location: 'San Francisco, CA',
      dateText: 'Oct 22–23, 2025',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/pytorch-conference/',
      sessions: [
        {
          title: 'Serving PyTorch LLMs at Scale: Disaggregated Inference With Kubernetes and llm-d',
          date: 'Thu, Oct 23, 2025',
          time: '11:35am – 12:00pm PDT',
          location: 'Room 2009 - 2011',
          href: 'https://pytorchconference.sched.com/event/27QDr',
        },
        {
          title: 'Open Source AI Production Stack with PyTorch and Red Hat AI',
          date: 'Thu, Oct 23, 2025',
          time: '10:35am – 10:45am PDT',
          location: 'Exhibit Hall - Booth D2',
          href: 'https://pytorchconference.sched.com/event/29Xx0?iframe=no',
        },
      ],
    },
    {
      month: 'November 2025',
      title: 'KubeCon + CloudNativeCon North America 2025',
      location: 'Atlanta, GA',
      dateText: 'Nov 10–13, 2025',
      cost: 'Paid',
      href: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/',
      sessions: [
        {
          title: 'Best Practices for Leveraging llm-d for Production-Scale Inference',
          date: 'Tue, Nov 11, 2025',
          time: '2:30pm – 3:00pm EST',
          location: 'Building B | Level 5 | Thomas Murphy Ballroom 1',
          href: 'https://kccncna2025.sched.com/event/27FWE?iframe=no',
        },
        {
          title: 'Routing Stateful AI Workloads in Kubernetes',
          date: 'Tue, Nov 11, 2025',
          time: '4:15pm – 4:45pm EST',
          location: 'Building B | Level 4 | B401-402',
          href: 'https://kccncna2025.sched.com/event/27FX6?iframe=no',
        },
        {
          title: 'llm-d: Multi-Accelerator LLM Inference on Kubernetes',
          date: 'Thu, Nov 13, 2025',
          time: '2:30pm – 3:00pm EST',
          location: 'Building B | Level 4 | B401-402',
          href: 'https://kccncna2025.sched.com/event/27Fee?iframe=no',
        },
        {
          title: 'Navigating the Rapid Evolution of Large Model Inference: Where Does Kubernetes Fit?',
          date: 'Wed, Nov 12, 2025',
          time: '2:15pm – 2:45pm EST',
          href: 'https://kccncna2025.sched.com/event/27Nlv?iframe=no',
        },
        {
          title: 'KServe Next: Advancing Generative AI Model Serving',
          date: 'Mon, Nov 10, 2025',
          time: '2:05pm – 2:30pm EST',
          href: 'https://colocatedeventsna2025.sched.com/event/28D4J',
        },
      ],
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

  const sessionListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const sessionItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '10px',
    border: '1px solid var(--ifm-color-emphasis-200)',
    borderLeft: '3px solid var(--ifm-color-primary)',
    borderRadius: '6px',
    backgroundColor: 'var(--ifm-background-surface-color)'
  };

  const headerRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '6px'
  };

  const sessionSectionStyle = {
    marginTop: '10px',
    padding: '12px',
    border: '1px solid var(--ifm-color-emphasis-200)',
    borderRadius: '8px',
    backgroundColor: 'var(--ifm-color-emphasis-100)'
  };

  const titleRowLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  };

  // no icon-only button in this variant

  const getSessionStartEpoch = (s) => {
    try {
      const monthMap = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const dateText = String(s.date || '');
      const timeText = String(s.time || '');

      const dateMatch = dateText.match(/([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})/);
      if (!dateMatch) return Number.MAX_SAFE_INTEGER;
      const monthIdx = monthMap[dateMatch[1]];
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);

      const timeMatch = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
      const hour12 = timeMatch ? parseInt(timeMatch[1] || '0', 10) : 0;
      const minute = timeMatch && timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = timeMatch ? (timeMatch[3] || '').toLowerCase() : 'am';
      let hour24 = hour12 % 12;
      if (meridiem === 'pm') hour24 += 12;

      const dt = new Date(year, monthIdx, day, hour24, minute, 0, 0);
      return dt.getTime();
    } catch {
      return Number.MAX_SAFE_INTEGER;
    }
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
                  {e.sessions && e.sessions.length > 0 && (
                    <div style={sessionSectionStyle}>
                      <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: 'var(--ifm-color-primary)'}}>Sessions</p>
                      <ul style={sessionListStyle}>
                        {[...e.sessions].sort((a, b) => getSessionStartEpoch(a) - getSessionStartEpoch(b)).map((s) => (
                          <li key={`${s.title}-${s.date}-${s.time}`} style={sessionItemStyle}>
                            <div>
                              <a href={s.href} target="_blank" rel="noopener noreferrer" style={{fontWeight: 600, color: 'var(--ifm-color-primary)'}}>{s.title}</a>
                              <div style={{fontSize: '12px', marginTop: '4px'}}>
                                {s.date} · {s.time}
                              </div>
                            </div>
                            <div style={{whiteSpace: 'nowrap'}}>
                              <a href={s.href} target="_blank" rel="noopener noreferrer" style={buttonStyle}>View details</a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
})()}