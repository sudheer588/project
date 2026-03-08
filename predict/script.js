function predictSalary() {

    let experience = parseFloat(document.getElementById("experience").value);

    if(isNaN(experience) || experience < 0) {
        alert("Enter valid experience!");
        return;
    }

    // Simple Linear Prediction Formula
    // Base Salary = 20000
    // Every Year Experience = +5000

    let predictedSalary = 20000 + (experience * 5000);

    document.getElementById("result").innerHTML =
        "Predicted Salary: ₹ " + predictedSalary;
}