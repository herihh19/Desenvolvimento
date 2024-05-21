"use client";

import { ref, onValue, push } from "firebase/database";
import { db } from "../../services/firebase/firebaseConfiguration";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IPlace {
  [key: string]: {
    nome: string;
    endereco: string;
    situacao: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [newPlace, setNewPlace] = useState({
    nome: "",
    endereco: "",
    situacao: "",
  });

  const addNewPlace = () => {
    push(ref(db, "/locais"), newPlace);
    setNewPlace({ nome: "", endereco: "", situacao: "" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewPlace();
          }}
        >
          <div className="mb-4">
            <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
              Cadastrar local
            </h2>
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="nome"
            >
              Nome:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nome"
              type="text"
              placeholder="Nome"
              value={newPlace.nome}
              onChange={(e) =>
                setNewPlace({ ...newPlace, nome: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="endereco"
            >
              Endereço:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endereco"
              type="text"
              placeholder="Endereço"
              value={newPlace.endereco}
              onChange={(e) =>
                setNewPlace({ ...newPlace, endereco: e.target.value })
              }
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="situacao"
            >
              Situação:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="situacao"
              type="text"
              placeholder="Situação"
              value={newPlace.situacao}
              onChange={(e) =>
                setNewPlace({ ...newPlace, situacao: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Adicionar Local
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
