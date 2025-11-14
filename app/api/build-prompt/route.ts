import { NextResponse } from 'next/server';
import { buildBulletinPrompt } from '@/lib/bulletinPromptTemplate';

const ICS_URL = 'https://stjohnarmenianchurch.com/calendar.ics';
const XML_URL = 'https://stjohnarmenianchurch.com/calendar.xml';
const READINGS_API_URL = 'https://api.fastandpray.app/api/readings/';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bulletinDateDisplay, bulletinDateIso, videoUrls = [] } = body;

    // Validate required fields
    if (!bulletinDateDisplay || !bulletinDateIso) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch calendar feeds
    let icsContent = '';
    let xmlContent = '';
    let readingsContent = '';

    try {
      const icsResponse = await fetch(ICS_URL);
      if (icsResponse.ok) {
        icsContent = await icsResponse.text();
      } else {
        icsContent = '<!-- calendar.ics could not be fetched -->';
      }
    } catch (error) {
      icsContent = '<!-- calendar.ics could not be fetched -->';
    }

    try {
      const xmlResponse = await fetch(XML_URL);
      if (xmlResponse.ok) {
        xmlContent = await xmlResponse.text();
      } else {
        xmlContent = '<!-- calendar.xml could not be fetched -->';
      }
    } catch (error) {
      xmlContent = '<!-- calendar.xml could not be fetched -->';
    }

    // Fetch readings API with bulletin date
    try {
      const readingsUrl = `${READINGS_API_URL}?date=${bulletinDateIso}&format=json`;
      const readingsResponse = await fetch(readingsUrl);
      if (readingsResponse.ok) {
        const readingsData = await readingsResponse.json();
        readingsContent = JSON.stringify(readingsData, null, 2);
      } else {
        readingsContent = '<!-- readings API could not be fetched -->';
      }
    } catch (error) {
      readingsContent = '<!-- readings API could not be fetched -->';
    }

    // Build the final prompt
    const prompt = buildBulletinPrompt({
      bulletinDateDisplay,
      bulletinDateIso,
      videoUrls,
      icsContent,
      xmlContent,
      readingsContent,
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error building prompt:', error);
    return NextResponse.json(
      { error: 'Failed to build prompt' },
      { status: 500 }
    );
  }
}
