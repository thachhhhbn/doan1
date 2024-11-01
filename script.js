function ipToBinary(ip) {
  const octets = ip.split(".");
  const binaryOctets = octets.map((octet) => {
    if (octet === "" || isNaN(octet) || parseInt(octet) > 255 || parseInt(octet) < 0) {
      return "";
    }
    return parseInt(octet, 10).toString(2).padStart(8, "0");
  });
  return binaryOctets.join(".");
}

function cidrToSubnetMask(cidr) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(cidr, 8);
    mask.push(256 - Math.pow(2, 8 - bits));
    cidr -= bits;
  }
  return mask.join(".");
}

function cidrToBinary(cidr) {
  let binaryMask = "".padStart(cidr, "1").padEnd(32, "0");
  return binaryMask.match(/.{1,8}/g).join(".");
}

function updateBinaryIp() {
  const ipInput = document.querySelector('input[name="ip"]').value;
  const subnetInput = document.querySelector('input[name="subnet-mask"]').value;

  const ipBinaryOutput = document.querySelector(".ip-binary");
  const subnetBinaryOutput = document.querySelector(".subnet-mask-binary");
  const subnetNumberOutput = document.querySelector(".subnet-mask-number");

  ipBinaryOutput.value = ipToBinary(ipInput);

  if (subnetInput && !isNaN(parseInt(subnetInput))) {
    const cidr = parseInt(subnetInput);
    subnetBinaryOutput.value = cidrToBinary(cidr);
    subnetNumberOutput.value = cidrToSubnetMask(cidr);
  } else {
    subnetBinaryOutput.value = "";
    subnetNumberOutput.value = "";
  }
}

function validateIp(ip) {
  const octets = ip.split(".");
  if (octets.length !== 4) return false;

  return octets.every((octet) => {
    const num = parseInt(octet, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

function calculateSubnets() {
  const subnetInput = document.querySelector('input[name="subnet-mask"]').value;
  const ipInput = document.querySelector('input[name="ip"]').value;

  if (!validateIp(ipInput) || isNaN(parseInt(subnetInput)) || parseInt(subnetInput) < 0 || parseInt(subnetInput) > 32) {
    alert("Vui lòng nhập địa chỉ IP và Subnet Mask hợp lệ (0-32)");
    return;
  }

  const subnetMaskBits = parseInt(subnetInput);
  const numberOfSubnets = Math.pow(2, 32 - subnetMaskBits);
  const numberOfHosts = Math.pow(2, 32 - subnetMaskBits) - 2;
  const binaryIp = ipToBinary(ipInput).replace(/\./g, "");

  const resultDiv = document.querySelector(".result");
  resultDiv.innerHTML = ""; // Clear previous results

  for (let i = 0; i < numberOfSubnets; i++) {
    const subnetBinary = (parseInt(binaryIp.substr(0, subnetMaskBits), 2) + i)
      .toString(2)
      .padEnd(32, "0");
    const networkAddress = binaryToIp(subnetBinary);

    const broadcastBinary = subnetBinary.substr(0, subnetMaskBits).padEnd(32, "1");
    const broadcastAddress = binaryToIp(broadcastBinary);

    resultDiv.innerHTML += `
      <div class="network-block">
        Địa chỉ mạng ${i + 1}: ${networkAddress} có ${numberOfHosts} host, địa chỉ broadcast là ${broadcastAddress} <br/>
      </div>
    `;
  }
}

function calculateTotalSubnets() {
  const subnetInput = document.querySelector('input[name="subnet-mask"]').value;
  const ipInput = document.querySelector('input[name="ip"]').value;

  if (!validateIp(ipInput) || isNaN(parseInt(subnetInput)) || parseInt(subnetInput) < 0 || parseInt(subnetInput) > 32) {
    alert("Vui lòng nhập địa chỉ IP và Subnet Mask hợp lệ (0-32)");
    return;
  }

  const subnetMaskBits = parseInt(subnetInput);
  const totalSubnets = Math.pow(2, 32 - subnetMaskBits);
  const numberOfHosts = Math.pow(2, 32 - subnetMaskBits) - 2;

  const binaryIp = ipToBinary(ipInput).replace(/\./g, "");
  const networkBinary = binaryIp.substr(0, subnetMaskBits).padEnd(32, "0");
  const networkAddress = binaryToIp(networkBinary);
  const broadcastBinary = binaryIp.substr(0, subnetMaskBits).padEnd(32, "1");
  const broadcastAddress = binaryToIp(broadcastBinary);

  const resultDiv = document.querySelector(".result");
  resultDiv.innerHTML = `
    Tổng số đường mạng có thể: ${totalSubnets} <br/>
    Số host khả dụng trên mỗi mạng: ${numberOfHosts} <br/>
    Địa chỉ mạng mẫu (subnet đầu tiên): ${networkAddress} <br/>
    Địa chỉ broadcast mẫu (subnet đầu tiên): ${broadcastAddress}
  `;

  let calculateBtn = document.getElementById("calculateBtn");
  if (!calculateBtn) {
    calculateBtn = document.createElement("button");
    calculateBtn.id = "calculateBtn";
    calculateBtn.innerText = "Tính toán";
    calculateBtn.onclick = calculateSubnets;
    calculateBtn.style.marginTop = "20px";
  }
  resultDiv.appendChild(calculateBtn);
}

function binaryToIp(binary) {
  return binary
    .match(/.{1,8}/g)
    .map((bin) => parseInt(bin, 2))
    .join(".");
}
// Hàm hiển thị Subnet Calculator
// Hàm hiển thị Subnet Calculator và ẩn các phần khác
function showCalculator() {
  document.getElementById("calculator").style.display = "block";
  document.getElementById("resultContainer").style.display = "block";
  document.getElementById("studentList").style.display = "none";
  document.getElementById("studentDetails").style.display = "none";
}

// Hàm hiển thị Danh Sách Sinh Viên và ẩn các phần khác
function showStudentList() {
  document.getElementById("calculator").style.display = "none";
  document.getElementById("resultContainer").style.display = "none";
  document.getElementById("studentList").style.display = "block";
  document.getElementById("studentDetails").style.display = "none";
}

// Hàm hiển thị chi tiết sinh viên và ẩn Danh Sách Sinh Viên
function showStudentDetails(studentId) {
  const students = {
    SV001: {
      name: "Nguyễn Văn A",
      id: "SV001",
      class: "10A1",
      gpa: "8.5",
      photo: "images/student1.jpg"
    },
    SV002: {
      name: "Trần Thị B",
      id: "SV002",
      class: "10A2",
      gpa: "7.0",
      photo: "images/student2.jpg"
    },
    SV003: {
      name: "Lê Văn C",
      id: "SV003",
      class: "10A1",
      gpa: "9.0",
      photo: "images/student3.jpg"
    }
  };
  
  
  
  const student = students[studentId];
  document.getElementById("detailName").innerText = student.name;
  document.getElementById("detailId").innerText = student.id;
  document.getElementById("detailClass").innerText = student.class;
  document.getElementById("detailGPA").innerText = student.gpa;
  document.getElementById("detailPhoto").src = student.photo; // Hiển thị ảnh sinh viên

   // Hiển thị phần chi tiết và ẩn danh sách sinh viên
  document.getElementById("studentList").style.display = "none";
  document.getElementById("studentDetails").style.display = "block";
}

// Hàm quay lại Danh Sách Sinh Viên từ phần chi tiết sinh viên
function hideStudentDetails() {
  document.getElementById("studentDetails").style.display = "none";
  document.getElementById("studentList").style.display = "block";
}
