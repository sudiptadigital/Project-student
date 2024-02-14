import React, { useState, useEffect } from 'react';
import './App.css';

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  subjects: string[];
}
interface Subjects {
  sub_id: number;
  sub_name: string;

}

interface StudentBackend {
  student_id: number, 
  first_name: string, 
  last_name: string, 
  email: string, 
  subject_ids: number[]
}

const SUB_MAP = {
  1: 'Bengali',
  2: 'English',
  3: 'Math',
  4: 'Computer',
  5: 'History'
}


const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subjects[]>([]);
  const [formData, setFormData] = useState<StudentBackend>({
    student_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    subject_ids: [],
  });
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    try {
      let apiUrl = 'http://localhost:4000/api/v1/student';

      if (searchQuery) {
        apiUrl += `?search=${searchQuery}`;
      }
      
      const response1 = await fetch(apiUrl);
      const response2 = await fetch('http://localhost:4000/api/v1/subject');
        
      const studentData = await response1.json();
      const subjectsData = await response2.json();

      const transformStudentData = studentData['data']
      .map((student:StudentBackend ) => {
        return {
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          subjects: student.subject_ids.map((id) => SUB_MAP[id as keyof typeof SUB_MAP])
        };
      })
    
      setStudents(transformStudentData);
      
      setSubjects(subjectsData['data']);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;        

    if (name === 'subject_ids') {
      const updatedSubjects = (e.target as HTMLInputElement).checked
        ? [...formData.subject_ids, +value]
        : formData.subject_ids.filter((subject_id) => subject_id !== +value);

      setFormData((prevData) => ({ ...prevData, subject_ids: updatedSubjects }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if(edit){
         response = await fetch(`http://localhost:4000/api/v1/student/${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }else{
         response = await fetch('http://localhost:4000/api/v1/student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        fetchData();
        setFormData({
          student_id: 0,
          first_name: '',
          last_name: '',
          email: '',
          subject_ids: [],
        });
        setEdit(false);
        setEmail('');
        alert('Saved successfully')

      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = async (email: string) => {
    try {
      setEdit(true);
      setEmail(email);
      const response = await fetch(`http://localhost:4000/api/v1/student?email=${email}`);
      const studentData = await response.json();
      
      setFormData(studentData['data'][0]);
      
    } catch (error) {
      console.error('Error fetching student data for edit:', error);
    }
  };

  const handleDelete = async(email: string) => {
    alert('Are sure ????')
    const response = await fetch(`http://localhost:4000/api/v1/student/${email}`,{method: 'DELETE'});
    if (response.ok) {
    setStudents((prevStudents) => prevStudents.filter((student) => student.email !== email));
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto w-4/6 p-10">
      <h1 className="text-4xl font-bold mb-4">Student Management</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            disabled={edit}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Subjects</label>
          {subjects.map((subject) => (
            <div key={subject.sub_id} className="mb-2">
              <input
                type="checkbox"
                name="subject_ids"
                value={subject.sub_id}
                checked={formData.subject_ids?.includes(subject.sub_id)}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label>{subject.sub_name}</label>
            </div>
          ))}
        </div>  
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Save
        </button>
      </form>

      <div className="mb-4">
        <label className="block mb-2">Search Students</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter name or email..."
        />
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td className="border p-2">{student.first_name}</td>
              <td className="border p-2">{student.last_name}</td>
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">{student.subjects.join(', ')}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  onClick={() => handleEdit(student.email)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(student.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
