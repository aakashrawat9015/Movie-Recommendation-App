import { Client, Databases, Query, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchMovie, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal('searchMovie', searchMovie),
    ])

    // 2. If it does, update the count
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
        count: doc.count + 1,
      })
      // 3. If it doesn't, create a new document with the search term and count as 1
    } else {
      await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchMovie,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
    }
  } catch (error) {
    console.error(error);
  }
}


export const getTrendingSearches = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.orderDesc("count"),
      Query.limit(10),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}; 