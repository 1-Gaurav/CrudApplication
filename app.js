let companies = [];
let editIndex = null;
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("view-list").classList.toggle("d-none", btn.dataset.view !== "list");
    document.getElementById("view-form").classList.toggle("d-none", btn.dataset.view !== "form");
  });
});
document.getElementById("cancel").onclick = () => {
  document.getElementById("view-list").classList.remove("d-none");
  document.getElementById("view-form").classList.add("d-none");
  document.getElementById("companyForm").reset();
  document.getElementById("employees").innerHTML = "";
  editIndex = null;
};
document.getElementById("addEmp").onclick = () => addEmployeeBlock();
function addEmployeeBlock(emp={}) {
  const empDiv = document.createElement("div");
  empDiv.className = "emp-block border rounded p-3 mb-3";
  empDiv.innerHTML = `
    <div class="row g-3">
      <div class="col-md-4"><input class="form-control emp-name" placeholder="Employee Name*" maxlength="25" required value="${emp.empName||""}"></div>
      <div class="col-md-4">
        <select class="form-select emp-desig" required>
          <option value="">Designation</option>
          <option ${emp.designation==="Developer"?"selected":""}>Developer</option>
          <option ${emp.designation==="Manager"?"selected":""}>Manager</option>
          <option ${emp.designation==="System Admin"?"selected":""}>System Admin</option>
          <option ${emp.designation==="Team Lead"?"selected":""}>Team Lead</option>
          <option ${emp.designation==="PM"?"selected":""}>PM</option>
        </select>
      </div>
      <div class="col-md-4"><input type="date" class="form-control emp-date" required value="${emp.joinDate||""}"></div>
      <div class="col-md-6"><input type="email" class="form-control emp-email" placeholder="Email*" maxlength="100" required value="${emp.email||""}"></div>
      <div class="col-md-6"><input class="form-control emp-phone" placeholder="Phone*" maxlength="15" required value="${emp.phoneNumber||""}"></div>
    </div>
    <h6 class="mt-3">Skills</h6>
    <div class="skills"></div>
    <button type="button" class="btn btn-sm btn-outline-secondary addSkill">+ Add Skill</button>

    <h6 class="mt-3">Education</h6>
    <div class="education"></div>
    <button type="button" class="btn btn-sm btn-outline-secondary addEdu">+ Add Education</button>
  `;
  empDiv.querySelector(".addSkill").onclick = () => addSkillRow(empDiv.querySelector(".skills"));
  empDiv.querySelector(".addEdu").onclick = () => addEduRow(empDiv.querySelector(".education"));
  document.getElementById("employees").appendChild(empDiv);
}
function addSkillRow(container, skill={}) {
  const div = document.createElement("div");
  div.className = "skill-row row g-2 mb-2";
  div.innerHTML = `
    <div class="col-md-8">
      <select class="form-select skill-name" required>
        <option value="">Skill</option>
        ${["Java","Angular","CSS","HTML","JavaScript","UI","SQL","React","PHP","GIT","AWS","Python","Django","C","C++","C#","Unity","R","AI","NLP","Photoshop","Node.js"]
          .map(s=>`<option ${skill.skillName===s?"selected":""}>${s}</option>`).join("")}
      </select>
    </div>
    <div class="col-md-4"><input type="number" min="1" max="5" class="form-control skill-rate" placeholder="1-5" required value="${skill.skillRating||""}"></div>
  `;
  container.appendChild(div);
}
function addEduRow(container, edu={}) {
  const div = document.createElement("div");
  div.className = "edu-row row g-2 mb-2";
  div.innerHTML = `
    <div class="col-md-5"><input class="form-control edu-inst" placeholder="Institute*" maxlength="50" required value="${edu.instituteName||""}"></div>
    <div class="col-md-4"><input class="form-control edu-course" placeholder="Course*" maxlength="25" required value="${edu.courseName||""}"></div>
    <div class="col-md-3"><input class="form-control edu-year" placeholder="e.g. Mar 2021" required value="${edu.completedYear||""}"></div>
  `;
  container.appendChild(div);
}
function showMessage(msg, type="success") {
  const div = document.createElement("div");
  div.className = `alert alert-${type}`;
  div.innerText = msg;
  document.querySelector(".col.py-3").prepend(div);
  setTimeout(() => div.remove(), 3000);
}
document.getElementById("companyForm").onsubmit = e => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
  let employees = [];
  document.querySelectorAll("#employees .emp-block").forEach(emp => {
    let skills=[], edu=[];
    emp.querySelectorAll(".skill-row").forEach(s=>{
      skills.push({
        skillName:s.querySelector(".skill-name").value,
        skillRating:s.querySelector(".skill-rate").value
      });
    });
    emp.querySelectorAll(".edu-row").forEach(ed=>{
      edu.push({
        instituteName:ed.querySelector(".edu-inst").value,
        courseName:ed.querySelector(".edu-course").value,
        completedYear:ed.querySelector(".edu-year").value
      });
    });
    employees.push({
      empName: emp.querySelector(".emp-name").value,
      designation: emp.querySelector(".emp-desig").value,
      joinDate: emp.querySelector(".emp-date").value,
      email: emp.querySelector(".emp-email").value,
      phoneNumber: emp.querySelector(".emp-phone").value,
      skillInfo: skills,
      educationInfo: edu
    });
  });
  const company = {
    companyName: form.companyName.value,
    address: form.address.value,
    email: form.companyEmail.value,
    phoneNumber: form.companyPhone.value,
    createdAt: new Date().toLocaleDateString(),
    empInfo: employees
  };
  if(editIndex!==null){ companies[editIndex]=company; editIndex=null; }
  else companies.push(company);
  renderCompanies();
  document.getElementById("jsonOutput").textContent = JSON.stringify(company, null, 2);
  showMessage("Company details saved successfully.");
  form.reset(); document.getElementById("employees").innerHTML=""; 
  document.getElementById("view-list").classList.remove("d-none");
  document.getElementById("view-form").classList.add("d-none");
};
function renderCompanies() {
  const tbody = document.getElementById("companyTable");
  tbody.innerHTML = "";
  companies.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.companyName}</td>
        <td>${c.email}</td>
        <td>${c.phoneNumber}</td>
        <td>${c.createdAt}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editCompany(${i})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCompany(${i})">Delete</button>
        </td>
      </tr>`;
  });
}
function editCompany(index){
  const c = companies[index]; editIndex=index;
  const form=document.getElementById("companyForm");
  form.companyName.value=c.companyName;
  form.companyEmail.value=c.email;
  form.companyPhone.value=c.phoneNumber;
  form.address.value=c.address;
  document.getElementById("employees").innerHTML="";
  c.empInfo.forEach(e=>{
    addEmployeeBlock(e);
    let lastEmp=document.querySelector("#employees .emp-block:last-child");
    e.skillInfo.forEach(s=>addSkillRow(lastEmp.querySelector(".skills"),s));
    e.educationInfo.forEach(ed=>addEduRow(lastEmp.querySelector(".education"),ed));
  });
  document.getElementById("view-list").classList.add("d-none");
  document.getElementById("view-form").classList.remove("d-none");
}
function deleteCompany(index) {
  if (confirm("Are you sure you want to delete this company?")) {
    companies.splice(index, 1);
    renderCompanies();
    showMessage("Company deleted successfully.", "danger");
  }
}




