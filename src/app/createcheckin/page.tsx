"use client";

import { ref, push } from "firebase/database";
import { db } from "../../services/firebase/firebaseConfiguration";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function Home() {
  const { userAuth } = useAuthContext();
  const router = useRouter();
  const [newCheckin, setNewNewCheckin] = useState({
    id_local: "",
    data_hora: "",
    observacao: "",
    id_user: userAuth?.uid,
  });

  const addNewPlace = () => {
    push(ref(db, "/checkin"), newCheckin);
    setNewNewCheckin({
      id_local: "",
      data_hora: "",
      observacao: "",
      id_user: "",
    });
    router.push("/");
  };

  if (userAuth == null) {
    router.push("/signin");
    return null; // Evitar renderização de componentes desnecessários
  }

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
              Fazer checkin
            </h2>
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="idlocal"
            >
              Id do Local:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="idlocal"
              type="text"
              placeholder="Id do Local"
              value={newCheckin.id_local}
              onChange={(e) =>
                setNewNewCheckin({ ...newCheckin, id_local: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="datahora"
            >
              Data e Hora:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="datahora"
              type="text"
              placeholder="Data e Hora"
              value={newCheckin.data_hora}
              onChange={(e) =>
                setNewNewCheckin({ ...newCheckin, data_hora: e.target.value })
              }
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="observacao"
            >
              Observação:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="observacao"
              type="text"
              placeholder="Observação"
              value={newCheckin.observacao}
              onChange={(e) =>
                setNewNewCheckin({ ...newCheckin, observacao: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Checkin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
