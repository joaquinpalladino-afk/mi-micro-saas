'use client'

import {BEdit, BDelete} from '@/components/Buttons';
import {useState, useEffect} from 'react'
import { useParams } from 'next/navigation';

export default function TaskView() {
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const params = useParams();

const getTasks = async () => {
  const id = params.id;
  const response = await fetch(`/api/tasks/${id}`);
  const { tasks } = await response.json();
  setTasks(tasks);
}

useEffect(() => {
const fetchData = async () => {
try {
  await getTasks();
} catch (error) {
  console.log("Error fetching data:", error);
} finally {
  setLoading(false);
}
};

fetchData();
}, []);

if(!tasks){
return <div>Task not found!</div>
}

if (loading) {
  return <div>Cargando datos...</div>; 
}

return (
    <div>
        <h1 className='text-3xl font-bold underline'>Task Page</h1>
        <h2 className='text-2xl font-bold'>{tasks.title}</h2>
        <p className='text-xl'>{tasks.descrition}</p>
        <BEdit id={tasks.id} />
        <BDelete id={tasks.id} />
    </div>
)
}