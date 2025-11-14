export interface BulletinPromptOptions {
  bulletinDateDisplay: string;
  bulletinDateIso: string;
  todayDateIso: string;
  videoUrls: string[];
  icsContent: string;
  xmlContent: string;
  readingsContent: string;
}

export function buildBulletinPrompt(opts: BulletinPromptOptions): string {
  const {
    bulletinDateDisplay,
    bulletinDateIso,
    todayDateIso,
    videoUrls,
    icsContent,
    xmlContent,
    readingsContent,
  } = opts;

  // Build YouTube videos section
  let videoSection = '';
  if (videoUrls && videoUrls.length > 0) {
    videoSection = 'Include these videos in the "Videos of the Week" section:\n';
    videoUrls.forEach(url => {
      videoSection += `${url}\n`;
    });
  }

  const template = `St. John Armenian Church - Bulletin Generation Prompt Template

Copy and paste this prompt when generating bulletins:

***Please generate the weekly email bulletin for St. John Armenian Church using the stjohn-bulletin-generator skill.

Source Materials:

Print Bulletin (attached): Use the attached DOCX file as the primary content source for this week's bulletin

Extract Gospel reading reference and any key information

Extract any announcements or special content

Use Requiem Services information if included

Note any featured articles or spiritual content

Calendar Feeds (automatic):

XML Feed: https://stjohnarmenianchurch.com/calendar.xml

ICS Feed: https://stjohnarmenianchurch.com/calendar.ics

Reconcile event data from both feeds:

Dates and times from ICS

Descriptions and URLs from XML

Registration links from XML when available

Categorize events by date:

"This Week at St. John": Events within 7 days of ${todayDateIso}

"Coming Soon": Events 8+ days from ${todayDateIso}

Readings API:

Fetch Gospel reading from: https://api.fastandpray.app/api/readings/?date=${bulletinDateIso}&format=json

Use 1-2 sentence excerpt only

Include "Read Full Gospel" link to Bible Gateway

YouTube Videos:

${videoSection}Use thumbnails and "Watch Video" buttons

Critical Requirements:

❌ DO NOT include a masthead/header at the top

❌ DO NOT include a footer at the bottom

❌ DO NOT include a "Welcome to St. John" section

❌ DO NOT include contact information or church address

✅ Email content should be pure bulletin content only

✅ Email wrapper will add header/footer around content

✅ Follow the section order exactly:

Gospel Reading

Requiem Services (if in print bulletin)

This Week at St. John (events within 7 days)

Videos of the Week

Coming Soon (events 8+ days away)

Important Announcements (if any)

Article/Feature (if in print bulletin - LAST)

✅ Include action buttons on all events (Learn More, Register, etc.)

✅ Condense Gospel reading with "Read More" link

✅ Fetch and reconcile events from XML and ICS calendar feeds

Bulletin Details:

Date: ${bulletinDateDisplay}

Today's date: ${todayDateIso} (for calculating event categories)

Church Address (for verification only, NOT for inclusion in bulletin): 275 Olympia Way, San Francisco, CA 94131

Please generate the HTML bulletin and save it to /mnt/user-data/outputs/ with a descriptive filename.

***

RAW DATA (pasted by the web app since Claude cannot access external URLs):

[BEGIN_ICS]
${icsContent}
[END_ICS]

[BEGIN_XML]
${xmlContent}
[END_XML]

[BEGIN_READINGS_JSON]
${readingsContent}
[END_READINGS_JSON]`;

  return template;
}
