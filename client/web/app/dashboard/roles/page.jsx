"use client"; 

import axios from "axios";

const Roles = () => {
    const handle = async () => {       
        try {
            await axios.post("http://localhost:5000/university/addStudentDomain", {
                studentDomain: "samir"
            }, { withCredentials: true });
            console.log("successful");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen p-8">
            {/* Call handle function correctly */}
            <button onClick={handle}>nana</button>
        </div>
    );
};

export default Roles;
