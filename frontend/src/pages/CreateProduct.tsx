import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct, fetchCategory, fetchUnits } from "../services/service";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    units: [] as string[],
    categoryId: "",
  });

  // const [categories, setCategories] = useState<{ id: string; name: string; unit: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string, units: string[]}[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  
  const styleClassName = 'w-full p-3 rounded-xl border border-solid border-gray-400';


  useEffect(() => {
    const getData = async () => {
      try {
        const [categoriesData, unitsData] = await Promise.all([fetchCategory(), fetchUnits()]);
        console.log("Fetched categories: ", categoriesData); // DEBUG
        console.log("Fetched units: ", unitsData); // DEBUG
        
        setCategories(categoriesData);
        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);


  const resetForm = async () => {
    setProduct({
      name: "",
      price: 0,
      units: [],
      categoryId: "",
    });
  };

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting product: ", product); //DEBUG

    try {
      if (!product.name || product.price <= 0 || product.units.length === 0 || !product.categoryId) {
        toast.error("Please fill in all fields correctcly!");
        return;
      }
      await createProduct(product);
      toast.success("Product created!");
    } catch (error) {
      console.error("Error creating product: ", error); // DEBUG
      if (!navigator.onLine) {
        resetForm();
        return toast.success("You're offline. Save change when you're online!");
      }
      toast.error("Error creating product");
    }
    resetForm();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "units") {
      setProduct((prev) => ({
        ...prev,
        units: Array.from(new Set([...prev.units, value])), // Ensure unique unit selection
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

/*
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
*/
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
            onChange={handleChange}
            className={styleClassName}
          />
        </div>

        <div>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className={styleClassName}
          />
        </div>

        {/* <div>
          <input
            type="text"
            name="unit"
            value={product.units['name']}
            onChange={handleChange}
            placeholder="Unit"
            className={styleClassName}
          />
        </div> */}

        <div>
          {product.units.map((unitId) => {
            const unit = units.find((u) => u.id === unitId);
            return (
              <input
                key={unitId}
                type="text"
                value={unit ? unit.name : ""}
                readOnly
                className={styleClassName}
                placeholder="Unit"
              />
            );
          })}
        </div>

        <div>
          <select 
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className={`${styleClassName} text-white bg-gray-700`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {/* {category.name} ({ category.units?.length }  units) */}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block mb-1">Select Units</label>
          <select
            name="units"
            multiple
            value={product.units}
            // onChange={handleChange}
            onChange={(e) => 
              setProduct({ ...product, units: Array.from(e.target.selectedOptions, (option) => option.value) })
            }
            className={`${styleClassName} text-white bg-gray-700`}
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div> */}

        <div>
          <h3 className="mb-4 font-semibold text-gray-200 dark:text-white">Select Units</h3>
          <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {units.map((unit) => (
              <li key={unit.id} className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center ps-3">
                      <input id={`unit-${unit.id}`} 
                        type="checkbox" 
                        value={unit.id} 
                        onChange={(e) => {
                          const checked = e.target.checked; 
                          setProduct((prev) => {
                            const newUnits = checked
                              ? [...prev.units, unit.id] // add unit if checked
                              : prev.units.filter((id) => id !== unit.id); // deleted unit if not checked 
                              console.log("Updated units: ", newUnits);
                              
                              return { ...prev, units: newUnits };
                            });
                        }}
                        checked={product.units.includes(unit.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label htmlFor={`unit-${unit.id}`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{unit.name}</label>
                  </div>
              </li>
            ))}
              
          </ul>
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