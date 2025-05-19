"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SetupPage() {
  const [apiKey, setApiKey] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSaveApiKey = async () => {
    // In a real app, we'd validate and store these securely,
    // possibly by sending to a server or using secure client-side storage
    
    if (!apiKey) {
      setStatus('error');
      setMessage('Please enter a valid API key');
      return;
    }
    
    // Simulate success
    setStatus('success');
    setMessage('API key saved successfully');
    
    // Move to next step after a delay
    setTimeout(() => {
      setStep(2);
      setStatus('idle');
      setMessage('');
    }, 1500);
  };

  const handleSaveAssistantId = async () => {
    if (!assistantId) {
      setStatus('error');
      setMessage('Please enter a valid Assistant ID');
      return;
    }
    
    // Simulate success
    setStatus('success');
    setMessage('Assistant ID saved successfully');
    
    // Move to next step after a delay
    setTimeout(() => {
      setStep(3);
      setStatus('idle');
      setMessage('');
    }, 1500);
  };

  const handleCreatePhoneNumber = async () => {
    // In a real app, we'd call the Vapi API to create or link a phone number
    
    // Simulate success
    setPhoneNumber('+1-800-VAPI-AI');
    setStatus('success');
    setMessage('Phone number created successfully');
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Set Up Your Vapi AI Phone System</h1>
      
      <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-6 mb-8">
        <div className="flex mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${
                step === s 
                  ? 'bg-[#00F5A0] text-[#14152A]' 
                  : step > s 
                    ? 'bg-[#00F5A0] text-[#14152A]' 
                    : 'bg-[#1C1D2B] text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              
              {s < 3 && (
                <div className={`flex-1 h-0.5 ${
                  step > s ? 'bg-[#00F5A0]' : 'bg-[#1C1D2B]'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: API Key */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">API Keys</h2>
            <p className="text-gray-400 mb-6">
              Enter your Vapi API key to connect your account. You can find this in the Vapi dashboard.
            </p>
            
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                Vapi API Key
              </label>
              <input 
                id="apiKey"
                type="text" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#1C1D2B] border border-[#2E2D47] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-transparent"
                placeholder="vapi_01234567890abcdef..."
              />
              <p className="text-xs text-gray-500 mt-1">
                <Link href="https://dashboard.vapi.ai" target="_blank" className="text-[#00F5A0] hover:underline">
                  Go to Vapi Dashboard
                </Link> to get your API key
              </p>
            </div>
            
            <Button 
              onClick={handleSaveApiKey}
              className="bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/80"
            >
              Save API Key & Continue
            </Button>
          </div>
        )}
        
        {/* Step 2: Assistant ID */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Configure Assistant</h2>
            <p className="text-gray-400 mb-6">
              Enter your Assistant ID. Create an assistant in the Vapi dashboard and copy its ID here.
            </p>
            
            <div className="mb-6">
              <label htmlFor="assistantId" className="block text-sm font-medium text-gray-300 mb-2">
                Assistant ID
              </label>
              <input 
                id="assistantId"
                type="text" 
                value={assistantId}
                onChange={(e) => setAssistantId(e.target.value)}
                className="w-full bg-[#1C1D2B] border border-[#2E2D47] rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00F5A0] focus:border-transparent"
                placeholder="asst_01234567890abcdef..."
              />
              <p className="text-xs text-gray-500 mt-1">
                <Link href="https://dashboard.vapi.ai" target="_blank" className="text-[#00F5A0] hover:underline">
                  Create an assistant
                </Link> in the Vapi dashboard
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
              >
                Back
              </Button>
              <Button 
                onClick={handleSaveAssistantId}
                className="bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/80"
              >
                Save Assistant ID & Continue
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Phone Number */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Create Phone Number</h2>
            <p className="text-gray-400 mb-6">
              Create a phone number that users can call to interact with your AI assistant.
            </p>
            
            {phoneNumber ? (
              <div className="mb-6 bg-[#1C1D2B] rounded-md p-4 border border-[#2E2D47]">
                <div className="text-sm font-medium text-gray-300 mb-2">Your AI Phone Number</div>
                <div className="text-2xl font-mono text-[#00F5A0] mb-2">{phoneNumber}</div>
                <p className="text-xs text-gray-500">
                  Users can call this number to speak with your AI assistant.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-4">
                  When you create a phone number, it will be automatically linked to your assistant.
                </p>
                <Button 
                  onClick={handleCreatePhoneNumber}
                  className="bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/80"
                >
                  Create Phone Number
                </Button>
              </div>
            )}
            
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
              >
                Back
              </Button>
              <Link href="/" className="flex-1">
                <Button 
                  fullWidth
                  className="bg-[#00F5A0] text-[#14152A] hover:bg-[#00F5A0]/80"
                >
                  Finish Setup
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Status message */}
        {status !== 'idle' && (
          <div className={`mt-4 p-3 rounded-md ${
            status === 'success' ? 'bg-[#002D20] text-[#00F5A0]' : 'bg-[#3D1218] text-[#B83280]'
          }`}>
            <div className="flex items-center">
              {status === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Help section */}
      <div className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
        <p className="text-gray-400 mb-4">
          If you&apos;re unsure about any step, visit the Vapi documentation or contact support.
        </p>
        <div className="flex space-x-3">
          <Link href="https://docs.vapi.ai/" target="_blank" className="flex-1">
            <Button 
              fullWidth
              variant="outline"
            >
              View Documentation
            </Button>
          </Link>
          <Link href="mailto:support@vapi.ai" className="flex-1">
            <Button 
              fullWidth
              variant="ghost"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
