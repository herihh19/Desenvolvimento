"use client";

import { ref, onValue, remove } from "firebase/database";
import { db } from "../../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

interface ICheckin {
  [key: string]: {
    id: string;
    id_usuario: string;
    id_local: string;
    data_hora: string;
    observacao: string;
  };
}

interface IPlace {
  [key: string]: {
    nome: string;
    endereco: string;
    situacao: string;
  };
}

export default function Home() {
  const { userAuth } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<ICheckin>({});
  const [places, setPlaces] = useState<IPlace>({});

  useEffect(() => {
    const fetchDataCheckin = () => {
      const unsubscribeCheckins = onValue(
        ref(db, "/checkin"),
        (querySnapShot) => {
          const checkinsData: ICheckin = querySnapShot.val() || {};
          setCheckins(checkinsData);
        }
      );

      return () => unsubscribeCheckins();
    };

    const fetchDataLocais = () => {
      const unsubscribeLocais = onValue(ref(db, "/locais"), (querySnapShot) => {
        const placesData: IPlace = querySnapShot.val() || {};
        setPlaces(placesData);
        setLoading(false);
      });

      return () => unsubscribeLocais();
    };

    fetchDataCheckin();
    fetchDataLocais();
  }, []);

  function clearUser(userKey: string) {
    const userRef = ref(db, `/checkin/${userKey}`);
    remove(userRef);
  }

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
        {!loading &&
          Object.keys(checkins).map((checkinID) => {
            const checkin = checkins[checkinID];
            const place = places[checkin.id_local];
            return (
              <div key={checkinID} className="relative py-3">
                <div className="max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                  <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                      {checkinID.toUpperCase()}
                    </h2>
                    <div className="my-4">
                      <p className="text-gray-700">{`ID do local: ${checkin.id_local}`}</p>
                      <p className="text-gray-700">{`Data/Hora: ${checkin.data_hora}`}</p>
                      <p className="text-gray-700">{`Observação: ${checkin.observacao}`}</p>
                      <p className="text-gray-700">{`Id do Usuário: ${userAuth?.uid}`}</p>
                      <p className="text-gray-700">{`Nome do Local: ${
                        place ? place.nome : "Carregando..."
                      }`}</p>
                      <p className="text-gray-700">{`Endereço do Local: ${
                        place ? place.endereco : "Carregando..."
                      }`}</p>
                      <p className="text-gray-700">{`Situação do Local: ${
                        place ? place.situacao : "Carregando..."
                      }`}</p>

                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          onClick={() => clearUser(checkinID)}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
