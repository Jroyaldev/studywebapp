import { NextResponse } from 'next/server';
import { fetchScripture } from '../../services/bibleGatewayService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const translation = searchParams.get('translation') || 'KJV';

  if (!reference) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
  }

  try {
    console.log(`Fetching scripture: ${reference} (${translation})`);
    const scripture = await fetchScripture(reference, translation);
    
    if (scripture.verses.length === 0) {
      return NextResponse.json({ error: 'No verses found for the given reference' }, { status: 404 });
    }

    return NextResponse.json({
      type: scripture.verses.length === 1 ? 'verse' : 'chapter',
      verses: scripture.verses.map(v => ({
        reference: `${scripture.reference}:${v.number}`,
        content: v.text
      })),
      reference: scripture.reference
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}