import { JokeAPI } from '@bitstep/jokeapi'

export default async function Page() {
  const jokeClient = new JokeAPI()
  const joke = await jokeClient.getRandomJoke()
  
  return(
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
    </section>
  )
}

