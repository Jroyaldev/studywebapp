import { NextResponse } from 'next/server';
import { fetchScripture } from '../../services/bibleGatewayService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const translation = searchParams.get('translation') || 'KJV';
  const type = searchParams.get('type') || 'verse';

  if (!reference) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
  }

  try {
    console.log(`Fetching scripture: ${reference} (${translation}) - ${type}`);
    const scripture = await fetchScripture(reference, translation);
    
    if (scripture.verses.length === 0) {
      return NextResponse.json({ error: 'No verses found for the given reference' }, { status: 404 });
    }

    if (type === 'verse') {
      const verseNumber = reference.split(':')[1];
      const verse = scripture.verses.find(v => v.number === verseNumber) || scripture.verses[0];
      return NextResponse.json({
        type: 'verse',
        content: verse.text,
        reference: `${scripture.reference}:${verse.number}`
      });
    } else {
      return NextResponse.json({
        type: 'chapter',
        verses: scripture.verses.map(v => ({
          reference: `${scripture.reference}:${v.number}`,
          content: v.text
        })),
        reference: scripture.reference
      });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}