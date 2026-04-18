import { useState } from 'react';
import { HelpCircle, MessageCircle, BookOpen, Send, FileQuestion } from 'lucide-react';

const SupportView = () => {
  const [ticketMessage, setTicketMessage] = useState('');
  
  const blockStyle = {
    background: 'var(--bg-panel)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px -2px rgba(0, 0, 0, 0.02)'
  };

  const faqs = [
    { q: 'How do I pass parameters to an Automated Node?', a: 'Click the automated block on your canvas. In the Right Configuration Panel, enter standard JSON objects resolving variables natively.' },
    { q: 'Can I approve nodes autonomously?', a: 'Yes. Specify an automatic threshold limit (e.g. 5 days). The logic engine will branch directly out the Approved path automatically once simulation clears.' },
    { q: 'Is the data saved securely?', a: 'Currently, the execution environment safely parses all workflows directly into your browser local storage array. No external network requests are made unless directly mapped.' }
  ];

  return (
    <div style={{ padding: '40px', width: '100%', height: '100%', overflowY: 'auto', background: 'var(--bg-app)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: '#10b981', padding: '10px', borderRadius: '10px' }}>
          <HelpCircle size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Help & Contact Support</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Documentation and technical assistance for the HR Auto platform.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={blockStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <BookOpen size={18} color="#3b82f6" />
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Frequently Asked Questions</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-app)', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <FileQuestion size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} /> {faq.q}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, paddingLeft: '24px', lineHeight: '1.5' }}>{faq.a}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Right Column */}
        <div>
           <div style={blockStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <MessageCircle size={18} color="#8b5cf6" />
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Open a Support Ticket</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Issue Category</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                    <option>Technical Bug</option>
                    <option>Feature Request</option>
                    <option>Billing & Access</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Detailed Description</label>
                  <textarea 
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide execution logs or error parameters..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                  />
                </div>

                <button 
                  onClick={() => {
                    if(!ticketMessage.trim()) return alert('Please enter a description.');
                    alert('Ticket placed into queue successfully. Reference #8841-A');
                    setTicketMessage('');
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--text-primary)', color: 'var(--bg-panel)', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}
                >
                  <Send size={14} /> Submit Query
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SupportView;
