'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Skeleton } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectIsSupportPopupVisible } from '@/modules';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'earning' | 'technical' | 'payment';
  isExpanded?: boolean;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  category: 'contact' | 'help' | 'community';
}

 

const SupportPopup  = ( ) => {
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [supportOptions, setSupportOptions] = useState<SupportOption[]>([]);
  const [activeSection, setActiveSection] = useState<'faq' | 'contact' | 'help'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  
  const onClose = () => {
    dispatch(closePopup('isSupportPopupVisible'));
  };

  const visible = useSelector(selectIsSupportPopupVisible);

  // Mock FAQ data
  const mockFAQs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I earn points on TaskUp?',
      answer: 'You can earn points by completing daily tasks, watching ads, inviting friends, participating in surveys, and maintaining daily check-in streaks. Visit the Earning Center for all available opportunities.',
      category: 'earning'
    },
    {
      id: '2',
      question: 'How do I withdraw my earnings?',
      answer: 'Go to your profile, click on "Withdraw", select your preferred payment method, enter the amount (minimum $5), and submit your request. Withdrawals are processed within 24-48 hours.',
      category: 'payment'
    },
    {
      id: '3',
      question: 'Why can\'t I complete a task?',
      answer: 'Tasks may be unavailable due to: daily limits reached, geographic restrictions, device compatibility, or temporary maintenance. Try refreshing the app or check back later.',
      category: 'technical'
    },
    {
      id: '4',
      question: 'How do I invite friends?',
      answer: 'Go to the "Invite Friends" section, share your unique referral link via social media, messaging apps, or copy the link. You earn bonus points when friends join and complete their first task.',
      category: 'general'
    },
    {
      id: '5',
      question: 'What are vouchers and how do I use them?',
      answer: 'Vouchers are discounts you can redeem using your earned points. Visit the Voucher section, choose a voucher, redeem it with points, and use the provided code at partner stores.',
      category: 'general'
    },
    {
      id: '6',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login screen, enter your email address, and follow the instructions sent to your email to reset your password.',
      category: 'account'
    },
    {
      id: '7',
      question: 'Why is my account suspended?',
      answer: 'Accounts may be suspended for violating terms of service, suspicious activity, or fraudulent behavior. Contact support with your account details for review.',
      category: 'account'
    },
    {
      id: '8',
      question: 'App crashes or won\'t load properly',
      answer: 'Try these steps: 1) Force close and restart the app, 2) Clear app cache, 3) Update to the latest version, 4) Restart your device, 5) Reinstall the app if issues persist.',
      category: 'technical'
    }
  ];

  // Mock support options
  const mockSupportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Live Chat Support',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      action: 'chat',
      category: 'contact'
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: '📧',
      action: 'email',
      category: 'contact'
    },
    {
      id: '3',
      title: 'Help Center',
      description: 'Browse our comprehensive help documentation',
      icon: '📚',
      action: 'help-center',
      category: 'help'
    },
    {
      id: '4',
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: '🎥',
      action: 'tutorials',
      category: 'help'
    },
    {
      id: '5',
      title: 'Community Forum',
      description: 'Connect with other users and share experiences',
      icon: '👥',
      action: 'forum',
      category: 'community'
    },
    {
      id: '6',
      title: 'Report a Bug',
      description: 'Help us improve by reporting technical issues',
      icon: '🐛',
      action: 'bug-report',
      category: 'contact'
    }
  ];

  useEffect(() => {
    if (visible) {
      fetchSupportData();
    }
  }, [visible]);

  const fetchSupportData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFaqs(mockFAQs);
      setSupportOptions(mockSupportOptions);
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === faqId ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ));
  };

  const handleSupportAction = (action: string) => {
    console.log('Support action:', action);
    // Handle different support actions
    switch (action) {
      case 'chat':
        // Open live chat
        break;
      case 'email':
        // Open email client
        break;
      case 'help-center':
        // Navigate to help center
        break;
      case 'tutorials':
        // Open video tutorials
        break;
      case 'forum':
        // Open community forum
        break;
      case 'bug-report':
        // Open bug report form
        break;
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SectionButton = ({ 
    section, 
    label, 
    isActive 
  }: { 
    section: 'faq' | 'contact' | 'help'; 
    label: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
          : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div className="p-4 bg-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-purple-600 text-2xl">🆘</div>
            <h2 className="text-xl font-bold text-gray-800">Support Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-4">
          <SectionButton section="faq" label="FAQ" isActive={activeSection === 'faq'} />
          <SectionButton section="contact" label="Contact" isActive={activeSection === 'contact'} />
          <SectionButton section="help" label="Help" isActive={activeSection === 'help'} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {/* Search Skeleton */}
            <Skeleton 
              animated 
              style={{ height: '40px', borderRadius: '8px' }} 
            />
            
            {/* Content Skeleton */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Skeleton 
                      animated 
                      style={{ width: '32px', height: '32px', borderRadius: '8px' }} 
                    />
                    <div className="flex-1">
                      <Skeleton.Title animated style={{ fontSize: '16px', marginBottom: '8px' }} />
                      <Skeleton.Title animated style={{ fontSize: '14px' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Bar (for FAQ section) */}
            {activeSection === 'faq' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}

            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div className="space-y-3">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
                    <p className="text-gray-500">Try different keywords or browse all FAQs</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-4 text-left hover:bg-purple-100 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 pr-4">{faq.question}</h3>
                          <svg 
                            className={`w-5 h-5 text-purple-600 transition-transform duration-200 ${faq.isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {faq.isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                            <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="space-y-3">
                {supportOptions.filter(option => option.category === 'contact').map((option) => (
                  <div key={option.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <button
                      onClick={() => handleSupportAction(option.action)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{option.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{option.title}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Help Section */}
            {activeSection === 'help' && (
              <div className="space-y-4">
                {/* Help Resources */}
                <div className="space-y-3">
                  {supportOptions.filter(option => option.category === 'help' || option.category === 'community').map((option) => (
                    <div key={option.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <button
                        onClick={() => handleSupportAction(option.action)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{option.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{option.title}</h3>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-orange-600">💡</span>
                    Quick Tips
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>Check your internet connection if tasks won't load</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>Update the app regularly for the best experience</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>Clear app cache if you experience slow performance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>Contact support immediately for account issues</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-purple-600">📞</span>
                Contact Information
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="text-purple-600">support@taskup.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Response Time:</span>
                  <span>Within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Live Chat:</span>
                  <span>Monday - Friday, 9 AM - 6 PM EST</span>
                </div>
              </div>
            </div>

            {/* App Information */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-gray-600">ℹ️</span>
                App Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Version:</span>
                  <div>2.1.0</div>
                </div>
                <div>
                  <span className="font-medium">Build:</span>
                  <div>2024.12.1</div>
                </div>
                <div>
                  <span className="font-medium">Platform:</span>
                  <div>Telegram WebApp</div>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <div>Dec 1, 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default SupportPopup;
