import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route Handler for OpenCode Agent API
 * Proxies requests to the OpenCode server running on localhost:4096
 */

const OPENCODE_API_URL = process.env.OPENCODE_API_URL || 'http://localhost:4096';

export async function GET() {
  try {
    // Forward the request to the OpenCode API
    const response = await fetch(`${OPENCODE_API_URL}/agent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`OpenCode API error: ${response.status} ${response.statusText}`);
      
      // Return mock data for development if OpenCode server is not running
      // Return array directly to match OpenCode SDK app.agents() response format
      return NextResponse.json([
        {
          id: 'architect',
          name: 'Architect',
          description: 'System design and architecture planning specialist',
          mode: 'primary',
          builtIn: true,
          color: '#A3B087',
          permission: {
            edit: 'allow',
            webfetch: 'allow',
            bash: {
              read: 'allow',
              write: 'allow',
            },
          },
          model: {
            providerID: 'anthropic',
            modelID: 'claude-3-5-sonnet-20241022',
          },
          temperature: 0.7,
          topP: 0.9,
        },
        {
          id: 'engineer',
          name: 'Engineer',
          description: 'Code implementation and technical problem-solving expert',
          mode: 'primary',
          builtIn: true,
          color: '#435663',
          permission: {
            edit: 'allow',
            webfetch: 'allow',
            bash: {
              read: 'allow',
              write: 'allow',
            },
          },
          model: {
            providerID: 'anthropic',
            modelID: 'claude-3-5-sonnet-20241022',
          },
          temperature: 0.5,
          topP: 0.85,
        },
        {
          id: 'researcher',
          name: 'Researcher',
          description: 'Information gathering and analysis specialist',
          mode: 'subagent',
          builtIn: true,
          color: '#FFF8D4',
          permission: {
            edit: 'deny',
            webfetch: 'allow',
            bash: {
              read: 'allow',
              write: 'deny',
            },
          },
          model: {
            providerID: 'anthropic',
            modelID: 'claude-3-5-sonnet-20241022',
          },
          temperature: 0.6,
          topP: 0.9,
        },
        {
          id: 'qa-tester',
          name: 'QA Tester',
          description: 'Quality assurance and testing automation expert',
          mode: 'subagent',
          builtIn: true,
          color: '#313647',
          permission: {
            edit: 'allow',
            webfetch: 'deny',
            bash: {
              read: 'allow',
              write: 'allow',
            },
          },
          model: {
            providerID: 'anthropic',
            modelID: 'claude-3-5-sonnet-20241022',
          },
          temperature: 0.4,
          topP: 0.8,
        },
      ]);
    }

    // Parse and return the response
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching agents from OpenCode API:', error);
    
    // Return mock data on error - array directly to match OpenCode SDK format
    return NextResponse.json([
      {
        id: 'architect',
        name: 'Architect',
        description: 'System design and architecture planning specialist',
        mode: 'primary',
        builtIn: true,
        color: '#A3B087',
        permission: {
          edit: 'allow',
          webfetch: 'allow',
          bash: {
            read: 'allow',
            write: 'allow',
          },
        },
        model: {
          providerID: 'anthropic',
          modelID: 'claude-3-5-sonnet-20241022',
        },
        temperature: 0.7,
        topP: 0.9,
      },
      {
        id: 'engineer',
        name: 'Engineer',
        description: 'Code implementation and technical problem-solving expert',
        mode: 'primary',
        builtIn: true,
        color: '#435663',
        permission: {
          edit: 'allow',
          webfetch: 'allow',
          bash: {
            read: 'allow',
            write: 'allow',
          },
        },
        model: {
          providerID: 'anthropic',
          modelID: 'claude-3-5-sonnet-20241022',
        },
        temperature: 0.5,
        topP: 0.85,
      },
      {
        id: 'researcher',
        name: 'Researcher',
        description: 'Information gathering and analysis specialist',
        mode: 'subagent',
        builtIn: true,
        color: '#FFF8D4',
        permission: {
          edit: 'deny',
          webfetch: 'allow',
          bash: {
            read: 'allow',
            write: 'deny',
          },
        },
        model: {
          providerID: 'anthropic',
          modelID: 'claude-3-5-sonnet-20241022',
        },
        temperature: 0.6,
        topP: 0.9,
      },
      {
        id: 'qa-tester',
        name: 'QA Tester',
        description: 'Quality assurance and testing automation expert',
        mode: 'subagent',
        builtIn: true,
        color: '#313647',
        permission: {
          edit: 'allow',
          webfetch: 'deny',
          bash: {
            read: 'allow',
            write: 'allow',
          },
        },
        model: {
          providerID: 'anthropic',
          modelID: 'claude-3-5-sonnet-20241022',
        },
        temperature: 0.4,
        topP: 0.8,
      },
    ]);
  }
}
