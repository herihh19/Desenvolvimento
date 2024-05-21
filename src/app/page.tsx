"use client";

import { ref, onValue, remove } from "firebase/database";
import { db } from "../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import Link from "next/link";

interface IPlace {
  [key: string]: {
    nome: string;
    endereco: string;
    situacao: string;
  };
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<IPlace>({});

  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(ref(db, "/locais"), (querySnapShot) => {
        const placesData: IPlace = querySnapShot.val() || {};
        console.log(placesData);
        setPlaces(placesData);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  function clearUser(userKey: string) {
    const userRef = ref(db, `/locais/${userKey}`);
    remove(userRef);
  }

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
        {!loading &&
          Object.keys(places).map((userId) => (
            <div key={userId} className="relative py-3">
              <div className="max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {loading
                      ? "Carregando..."
                      : `${places[userId].nome}`.toUpperCase()}
                  </h2>
                  <div className="my-4">
                    <p className="text-gray-700">{`ID: ${userId}`}</p>
                    <p className="text-gray-700">{`Endereço: ${places[userId].endereco}`}</p>
                    <p className="text-gray-700">{`Situação: ${places[userId].situacao}`}</p>

                    <div className="flex justify-center space-x-4 mt-4">
                      <Link href={`/local/${userId}`}>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                          Detalhes
                        </button>
                      </Link>
                      <Link href={`/editarlocal/${userId}`}>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                          Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => clearUser(userId)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
