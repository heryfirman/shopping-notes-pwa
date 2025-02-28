import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct, fetchCategory } from "../services/service";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    unit: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState<{ id: string; name: string; unit: string }[]>([]);
  const styleClassName = 'w-full p-3 rounded-xl border border-solid border-gray-400';


  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    }
    getCategories();
  }, []);

  const resetForm = () => {
    setProduct({
        name: "",
        price: 0,
        unit: "",
        categoryId: ""
    });
  }

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (!product.name || product.price <= 0 || !product.unit || !product.categoryId) {
          toast.error("Please fill in all fields correctcly.");
          return;
        }
        await createProduct(product);
        toast.success("Product created!");
    } catch (error) {
        if (!navigator.onLine) {
            resetForm();
            return toast.success("You're offline. Save the change when your online!");
        }
        toast.error("Error to create product");
    }
  }

  const handlechange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" ? Number(value) : value,
    }));
  }

  console.log(product);

  return (
    <Layout>
      <form onSubmit={handleForm}
       className="flex justify-center flex-col space-y-5">
        <div className="flex justify-start mb-20">
          <Link to="/products" className="w-full flex mr-auto gap-2 mt-4">
            <IoArrowBack className="text-xl my-auto" />
          </Link>
        </div>

        <div>
          <input
            type="text"
            name="name"
            value={product.name}
            placeholder="Nama Produk"
            onChange={handlechange}
            className={styleClassName}
          />
        </div>

        <div>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handlechange}
            className={styleClassName}
          />
        </div>

        <div>
          <input
            type="text"
            name="unit"
            value={product.unit}
            onChange={handlechange}
            placeholder="Unit"
            className={styleClassName}
          />
        </div>

        <div>
          <select 
            name="categoryId"
            value={product.categoryId}
            onChange={handlechange}
            className={`${styleClassName} text-white bg-gray-700`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="mx-auto">
          <button
            type="submit"
            className="w-40 py-3 mx-auto rounded-xl cursor-pointer bg-amber-600 text-black"
          >
            Submit
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateProduct;
