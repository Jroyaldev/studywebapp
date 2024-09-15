'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header' // Ensure Header uses updated styles
import NotesSection from './components/NotesSection'
import DynamicInfo from './components/DynamicInfo'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ScrollArea from './components/ScrollArea' // Updated import path
import Textarea from './components/Textarea' // Updated import path
import { Search } from "lucide-react"
import styles from './page.module.css'

const ScriptureLookup = dynamic(() => import('./components/ScriptureLookup'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  const [dynamicInfo, setDynamicInfo] = useState('')
  const [notes, setNotes] = useState('')
  const [scriptures, setScriptures] = useState([
    "1 In the beginning God created the heavens and the earth.",
    "2 Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
    "3 And God said, 'Let there be light,' and there was light.",
    "4 God saw that the light was good, and he separated the light from the darkness.",
    "5 God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day."
  ]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
    // Update dynamic info based on notes if needed
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Scripture Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex space-x-2 mb-4">
                <Input placeholder="Search scripture..." className="w-64" />
                <Button type="submit" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <ScriptureLookup scriptures={scriptures} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Type your notes here..." 
                  value={notes}
                  onChange={handleNotesChange}
                  className="min-h-[200px] mb-4"
                />
                <Button className="w-full">
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dynamic Info</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px] rounded-md">
                  <ul className="space-y-2">
                    {dynamicInfo.length > 0 ? (
                      dynamicInfo.map((info, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2"></span>
                          {info}
                        </li>
                      ))
                    ) : (
                      <li>No insights available yet. Start typing in the notes section.</li>
                    )}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
