import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { IoArrowBack } from "react-icons/io5"
import { ChangeEvent, FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { createNote } from "../services/service"



const Create = () => {
  const [note, setNote] = useState({
    body: "",
    priority: 1
  });

  const styleClassName = 'w-full p-3 rounded-xl border border-solid border-gray-400';

  const resetForm = () => {
    setNote({
        body: "",
        priority: 1
    })
  }

  // handle form 
  // reset prevent
  // try catch
  // if !body & !priority return
  // else createNotes & reset form
  // show toast notify success
  
  // catch :
  // if !navigator.onLine reset form
  // return toast notyf succeess
  // else show notyf error
  const handleForm = async (e: FormEvent) => {
    e.preventDefault()
    try {
        if (!note.body && !note.priority) return;
        await createNote(note)
        resetForm()
        toast.success("Note created!")
    } catch (error) {
        if (!navigator.onLine) {
            resetForm()
            return toast.success("You're offline. save the change when your online!")
        }
        toast.error("Error to create note")
    }
  }

  const handlechange = (e: ChangeEvent<HTMLInputElement>) => {
    setNote((note) => ({
        ...note,
        [e.target.name]: e.target.value,
    }));
  }

  console.log(note);
  
  return (
    <Layout>
      <form onSubmit={handleForm}
        className="flex justify-center flex-col space-y-5">
        <div className="flex justify-start mb-20">
            <Link to='/notes' className="w-full flex mr-auto gap-2 mt-4">
                <IoArrowBack className="text-xl my-auto" />
            </Link>
        </div>

        <div>
            <input type="text"
              name="body"
              value={note.body}
              placeholder="Nama Produk"
              onChange={handlechange}
              className={styleClassName} 
            />
        </div>

        <div>
            <input type="number"
              name="priority"
              value={note.priority}
              onChange={handlechange}
              className={styleClassName}
            />
        </div>

        <div className="mx-auto">
            <button type="submit"
                className="w-40 py-3 mx-auto rounded-xl cursor-pointer bg-amber-600 text-black"
            >
              Submit    
            </button>
        </div>
      </form>
    </Layout>
  )
}

export default Create
