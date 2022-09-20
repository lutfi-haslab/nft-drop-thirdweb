import { Children } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { sanityClient, urlFor } from "../sanity";
import { Collection } from "../typings";
import Link from "next/link";

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  console.log(collections);
  return (
    <div className="max-w-7xl flex flex-col min-h-screen mx-auto py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-10 text-4xl font-extralight">
        The{" "}
        <span className="font-extrabold underline decoration-pink-600/50">
          PrifaLab
        </span>{" "}
        NFT Market Place
      </h1>
      <main className="bg-slate-100 p-10 shadow-lg shadow-rose-400 rounded-lg">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Children.toArray(
            collections.map((collection) => (
              <Link href={`/nft/${collection.slug.current}`}>
                <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
                  <img
                    className="h-96 w-60 object-cover rounded-2xl"
                    src={urlFor(collection.mainImage).url()}
                    alt=""
                  />
                  <div>
                    <h1 className="text-3xl">{collection.title}</h1>
                    <p className="mt-2 text-sm text-gray-400">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage{
      asset
    },
    slug {
      current
    },
    creator -> {
      _id,
      name,
      address,
      slug {
      current
    }
    }
  }`;

  const collections = await sanityClient.fetch(query);
  console.log(collections);

  return {
    props: {
      collections,
    },
  };
};
