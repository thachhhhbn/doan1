// Hàm chuyển đổi địa chỉ IP sang nhị phân theo từng octet
function ipToBinary(ip) {
  const octets = ip.split(".");
  const binaryOctets = octets.map((octet) => {
    if (
      octet === "" ||
      isNaN(octet) ||
      parseInt(octet) > 255 ||
      parseInt(octet) < 0
    ) {
      return ""; // Nếu octet chưa nhập hoặc không hợp lệ thì bỏ trống
    }
    return parseInt(octet, 10).toString(2).padStart(8, "0");
  });
  return binaryOctets.join(".");
}

// Hàm chuyển đổi CIDR sang subnet mask dạng thập phân
function cidrToSubnetMask(cidr) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(cidr, 8);
    mask.push(256 - Math.pow(2, 8 - bits));
    cidr -= bits;
  }
  return mask.join(".");
}

// Hàm chuyển đổi CIDR sang subnet mask nhị phân
function cidrToBinary(cidr) {
  let binaryMask = "".padStart(cidr, "1").padEnd(32, "0");
  return binaryMask.match(/.{1,8}/g).join(".");
}

// Hàm cập nhật nhị phân theo thời gian thực cho IP và Subnet Mask
function updateBinaryIp() {
  const ipInput = document.querySelector('input[name="ip"]').value;
  const subnetInput = document.querySelector('input[name="subnet-mask"]').value;

  const ipBinaryOutput = document.querySelector(".ip-binary");
  const subnetBinaryOutput = document.querySelector(".subnet-mask-binary");
  const subnetNumberOutput = document.querySelector(".subnet-mask-number");

  // Cập nhật nhị phân cho IP
  ipBinaryOutput.value = ipToBinary(ipInput);

  // Cập nhật nhị phân và thập phân cho Subnet Mask
  if (subnetInput && !isNaN(parseInt(subnetInput))) {
    const cidr = parseInt(subnetInput);
    subnetBinaryOutput.value = cidrToBinary(cidr); // Hiển thị subnet mask nhị phân
    subnetNumberOutput.value = cidrToSubnetMask(cidr); // Hiển thị subnet mask dạng thập phân
  } else {
    subnetBinaryOutput.value = "";
    subnetNumberOutput.value = "";
  }
}

// Hàm kiểm tra định dạng IP hợp lệ
function validateIp(ip) {
  const octets = ip.split(".");
  if (octets.length !== 4) return false;

  return octets.every((octet) => {
    const num = parseInt(octet, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

// Hàm tính toán subnet và hiển thị kết quả
function calculateSubnets() {
  const ip = document.querySelector('input[name="ip"]').value;
  const subnet = document.querySelector('input[name="subnet-mask"]').value;

  if (
    !validateIp(ip) ||
    isNaN(parseInt(subnet)) ||
    parseInt(subnet) < 0 ||
    parseInt(subnet) > 32
  ) {
    alert("Vui lòng nhập địa chỉ IP hoặc Subnet Mask hợp lệ");
    return;
  }

  const binaryIp = ipToBinary(ip).replace(/\./g, "");
  const subnetMaskBits = parseInt(subnet);
  const numberOfSubnets = Math.pow(2, 32 - subnetMaskBits); // Tổng số subnets

  const resultDiv = document.querySelector(".result");
  resultDiv.innerHTML = ""; // Xóa kết quả cũ
  for (let i = 0; i < numberOfSubnets; i++) {
    const subnetBinary = (parseInt(binaryIp.substr(0, subnetMaskBits), 2) + i)
      .toString(2)
      .padEnd(32, "0");
    const networkAddress = binaryToIp(subnetBinary);

    const broadcastBinary = subnetBinary
      .substr(0, subnetMaskBits)
      .padEnd(32, "1");
    const broadcastAddress = binaryToIp(broadcastBinary);

    const numberOfHosts = Math.pow(2, 32 - subnetMaskBits) - 2; // Số host trừ địa chỉ mạng và broadcast

    // Hiển thị kết quả từng subnet
    resultDiv.innerHTML += `
        <div class="network-block">
          Địa chỉ mạng ${
            i + 1
          }: ${networkAddress} có ${numberOfHosts} host, địa chỉ broadcast là ${broadcastAddress} <br/>
        </div>
      `;
  }
}

// Hàm chuyển nhị phân sang IP thập phân
function binaryToIp(binary) {
  return binary
    .match(/.{1,8}/g)
    .map((bin) => parseInt(bin, 2))
    .join(".");
}
let menuVisible = false;

function toggleMenu() {
  const menu = document.getElementById("menu");
  const menuIcon = document.getElementById("menu-icon");
  const cal=document.querySelector(".cal");
  if (menuVisible) {
    // Đóng menu
    menu.classList.remove("active"); // Xóa lớp 'active'
    menuIcon.src = "./img/momenu.png"; // Thay đổi ảnh nút mở
  } else {
    // Mở menu
    menu.classList.add("active"); // Thêm lớp 'active'
    menuIcon.src = "./img/dongmenu.png"; // Thay đổi ảnh nút đóng
  }

  menuVisible = !menuVisible; // Đảo trạng thái hiển thị menu
  if (cal.classList.contains("margin-left-300")) {
    cal.classList.remove("margin-left-300");
  } else {
    cal.classList.add("margin-left-300");
  }
}
