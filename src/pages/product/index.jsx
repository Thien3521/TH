import React, { useEffect, useState } from 'react'
import axios from "axios"
const Products = () => {
    const [number, setNumber] = useState(1);
    const [data, setData] = useState([]);

    const getData = async () => {
        const response = await axios({
            url: 'https://fakestoreapi.com/products',
            method: "GET",
        });
        setData(response.data)
    }

    useEffect(() => {
        getData()
    },[])
  return (
    <div>
        <div>Products</div>
        <button onClick={() => setNumber(number + 1)}>Press me</button>
        <div>
            {data.map((item, index) => (
                <div key={item.id}>
                    <div>{item.title}</div>
                    <img src={item.image} alt='ic'/>
                    
                </div>
            ))}
        </div>
    </div>
  )
}

export default Products