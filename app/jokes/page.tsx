'use client'

import { useEffect, useState } from 'react'
import { JokeAPI, JokeCategory, JokeResponse } from '@bitstep/jokeapi'


export default function Page() {
  const [joke, setJoke] = useState<JokeResponse | null>(null)


  async function fetchJoke() {
    const jokeClient = new JokeAPI()
    const newJoke = await jokeClient.getJoke([JokeCategory.PROGRAMING, JokeCategory.SPOOKY])
    setJoke(newJoke)
  }

  useEffect(() => {
    fetchJoke()
  }, [])

  if (!joke) return <p>Loading...</p>

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Quirky Jokes
      </h1>
      {joke.type === 'twopart' ? (
        <>
          <p className="mb-2">{joke.setup}</p>
          <p className="font-semibold">{joke.delivery}</p>
        </>
      ) : (
        <p>{joke.joke}</p>
      )}
      
      <button onClick={fetchJoke} className="mt-4 underline">
        New joke perhaps
      </button>
    </section>
  )
}