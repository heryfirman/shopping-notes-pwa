import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchProducts } from "../services/service";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";

type TypeProduct = {
    id: string;
    name: string;
    price: number;
    unit: string;
    categoryId: string;
}

const Products = () => {
  const [products, setProducts] = useState<TypeProduct[]>([]);

  const getProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Layout>
      <header className="flex justify-between items-center w-full gap-2 mb-4">
        <Link to='/product/create' className="flex items-center gap-2 px-4 py-2 rounded-4xl border border-gray-300">
            <IoAdd className="text-2xl" />
            <span>Add Product</span>
        </Link>
      </header>

      <main>
        <ul>
           {products.map((product) => (
            <li key={product.id}>
                <h4>{product.name}</h4>
                <p>{product.price}</p>
                <div>
                    {product.unit}
                    <span>{product.categoryId}</span>
                </div>
                <Link to={`/product/edit/${product.id}`}>
                    <button className="text-2xl cursor-pointer">Edit</button>
                </Link>
            </li>
           ))}
        </ul>
      </main>
    </Layout>
  )
}

export default Products