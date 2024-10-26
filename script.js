// 1. IPv4 to IPv6 Conversion
function convertIPv4ToIPv6() {
    const ipv4 = document.getElementById('ipv4Input').value;
    const ipv6Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipv6Pattern.test(ipv4)) {
        const ipv6 = ipv4.replace(/\./g, ':');
        document.getElementById('ipv6Output').innerHTML = `The IPv6 equivalent is: ::ffff:${ipv6}`;
    } else {
        document.getElementById('ipv6Output').innerHTML = 'Invalid IPv4 address';
    }
}

// 2. IPv6 to IPv4 Conversion
function convertIPv6ToIPv4() {
    const ipv6 = document.getElementById('ipv6Input').value;
    const ipv4Pattern = /^::ffff:([0-9]{1,3}\.[ 0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})$/;

    if (ipv4Pattern.test(ipv6)) {
        const ipv4 = ipv6.replace(/^::ffff:/, '');
        document.getElementById('ipv4Output').innerHTML = `The IPv4 equivalent is: ${ipv4}`;
    } else {
        document.getElementById('ipv4Output').innerHTML = 'Invalid IPv6 address';
    }
}

// 3. IP to Decimal Conversion
function convertIPToDecimal() {
    const ip = document.getElementById('ipInput').value;
    const ipParts = ip.split('.');
    let decimal = 0;

    for (let i = 0; i < 4; i++) {
        decimal += parseInt(ipParts[i]) << (24 - i * 8);
    }

    document.getElementById('decimalOutput').innerHTML = `The decimal equivalent is: ${decimal}`;
}

// 4. Decimal to IP Conversion
function convertDecimalToIP() {
    const decimal = parseInt(document.getElementById('decimalInput').value);
    let ip = '';

    for (let i = 0; i < 4; i++) {
        ip += (decimal >> (24 - i * 8)) & 255;
        if (i < 3) {
            ip += '.';
        }
    }

    document.getElementById('ipOutput').innerHTML = `The IP equivalent is: ${ip}`;
}

// 5. Binary to IP Conversion
function convertBinaryToIP() {
    const binary = document.getElementById('binaryInput').value;
    const binaryParts = binary.split('.');
    let ip = '';

    for (let i = 0; i < 4; i++) {
        ip += parseInt(binaryParts[i], 2);
        if (i < 3) {
            ip += '.';
        }
    }

    document.getElementById('binaryOutput').innerHTML = `The IP equivalent is: ${ip}`;
}

// 6. Hexadecimal to IP Conversion
function convertHexToIP() {
    const hex = document.getElementById('hexInput').value;
    const hexParts = hex.split('.');
    let ip = '';

    for (let i = 0; i < 4; i++) {
        ip += parseInt(hexParts[i], 16);
        if (i < 3) {
            ip += '.';
        }
    }

    document.getElementById('hexOutput').innerHTML = `The IP equivalent is: ${ip}`;
}

// 7. Subnet Mask to CIDR Conversion
function convertSubnetToCIDR() {
    const subnet = document.getElementById('subnetInput').value;
    const subnetParts = subnet.split('.');
    let cidr = 0;

    for (let i = 0; i < 4; i++) {
        cidr += countLeadingZeros(parseInt(subnetParts[i], 10).toString(2));
    }

    document.getElementById('cidrOutput').innerHTML = `The CIDR equivalent is: /${cidr}`;
}

function countLeadingZeros(binary) {
    let count = 0;

    for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '0') {
            count++;
        } else {
            break;
        }
    }

    return count;
}

// 8. CIDR to Range Conversion
function convertCIDRToRange() {
    const cidr = parseInt(document.getElementById('cidrInput').value);
    const ipParts = document.getElementById('cidrInput').value.split('/');
    const ip = ipParts[0];
    const subnetMask = getSubnetMask(cidr);
    const startIP = getStartIP(ip, subnetMask);
    const endIP = getEndIP(ip, subnetMask);

    document.getElementById('rangeOutput').innerHTML = `The range is: ${startIP} - ${endIP}`;
}

function getSubnetMask(cidr) {
    let subnetMask = '';

    for (let i = 0; i < 32; i++) {
        if (i < cidr) {
            subnetMask += '1';
        } else {
            subnetMask += '0';
        }
    }

    return subnetMask.match(/.{1,8}/g).map(function (octet) {
        return parseInt(octet, 2).toString();
    }).join('.');
}

function getStartIP(ip, subnetMask) {
    const ipParts = ip.split('.');
    const subnetMaskParts = subnetMask.split('.');

    for (let i = 0; i < 4; i++) {
        ipParts[i] = parseInt(ipParts[i]) & parseInt(subnetMaskParts[i]);
    }

    return ipParts.join('.');
}

function getEndIP(ip, subnetMask) {
    const ipParts = ip.split('.');
    const subnetMaskParts = subnetMask.split('.');

    for (let i = 0; i < 4; i++) {
        ipParts[i] = parseInt(ipParts[i]) | ~parseInt(subnetMaskParts[i]);
    }

    return ipParts.join('.');
}

// 9. Range to CIDR Conversion
function convertRangeToCIDR() {
    const range = document.getElementById('rangeInput').value;
    const rangeParts = range.split(' - ');
    const startIP = rangeParts[0];
    const endIP = rangeParts[1];
    const startIPParts = startIP.split('.');
    const endIPParts = endIP.split('.');
    let cidr = 32;

    for (let i = 0; i < 4; i++) {
        const startOctet = parseInt(startIPParts[i], 10).toString(2);
        const endOctet = parseInt(endIPParts[i], 10).toString(2);

        for (let j = 0; j < 8; j++) {
            if (startOctet[j] !== endOctet[j]) {
                cidr -= 8 - j;
                break;
            }
        }
    }

    document.getElementById('cidrOutput2').innerHTML = `The CIDR equivalent is: /${cidr}`;
}

// 10. IPv6 Compress/Expand
function compressIPv6() {
    const ipv6 = document.getElementById('ipv6CompressInput').value;
    const ipv6Parts = ipv6.split(':');
    let compressedIPv6 = '';

    for (let i = 0; i < 8; i++) {
        if (ipv6Parts[i] === '0000') {
            compressedIPv6 += '::';
            i++;
        } else {
            compressedIPv6 += ipv6Parts[i];
        }

        if (i < 7) {
            compressedIPv6 += ':';
        }
    }

    document.getElementById('ipv6CompressOutput').innerHTML = `The compressed IPv6 is: ${compressedIPv6}`;
}

function expandIPv6() {
    const ipv6 = document.getElementById('ipv6CompressInput').value;
    const ipv6Parts = ipv6.split(':');
    let expandedIPv6 = '';

    for (let i = 0; i < 8; i++) {
        if (ipv6Parts[i] === '') {
            expandedIPv6 += '0000:';
        } else {
            expandedIPv6 += ipv6Parts[i].padStart(4, '0') + ':';
        }
    }

    document.getElementById('ipv6CompressOutput').innerHTML = `The expanded IPv6 is: ${expandedIPv6.slice(0, -1)}`;
}

// 11. Public vs. Private IP Check
function checkIPType() {
    const ip = document.getElementById('ipCheckInput').value;
    const privateIPRanges = [
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16'
    ];

    for (let i = 0; i < privateIPRanges.length; i++) {
        if (isIPInRange(ip, privateIPRanges[i])) {
            document.getElementById('ipCheckOutput').innerHTML = `The IP is private`;
            return;
        }
    }

    document.getElementById('ipCheckOutput').innerHTML = `The IP is public`;
}

function isIPInRange(ip, range) {
    const rangeParts = range.split('/');
    const rangeIP = rangeParts[0];
    const rangeCIDR = parseInt(rangeParts[1]);
    const ipParts = ip.split('.');
    const rangeIPParts = rangeIP.split('.');

    for (let i = 0; i < 4; i++) {
        if ((parseInt(ipParts[i]) & ((1 << rangeCIDR) - 1)) !== (parseInt(rangeIPParts[i]) & ((1 << rangeCIDR) - 1))) {
            return false;
        }
    }

    return true;
}

function lookupASN() {
    const ip = document.getElementById('asnInput').value;
    const output = document.getElementById('asnOutput');
    
    output.innerHTML = '<div class="loading"></div>';
    
    fetch(`https://ipapi.co/${ip}/json/`)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                throw new Error(data.reason);
            }
            output.innerHTML = `
                <div class="response">
                    <p>ASN: ${data.asn || 'N/A'}</p>
                    <p>Organization: ${data.org || 'N/A'}</p>
                </div>`;
        })
        .catch(error => {
            output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        });
}


function lookupGeo() {
    const ip = document.getElementById('geoInput').value;
    const output = document.getElementById('geoOutput');
    
    output.innerHTML = '<div class="loading"></div>';
    
    fetch(`http://ip-api.com/json/${ip}`)
        .then(response => response.json())
        .then(data => {
            if(data.status === 'fail') {
                throw new Error(data.message);
            }
            output.innerHTML = `
                <div class="response">
                    <p>Country: ${data.country}</p>
                    <p>City: ${data.city}</p>
                    <p>Region: ${data.regionName}</p>
                    <p>ISP: ${data.isp}</p>
                    <p>Timezone: ${data.timezone}</p>
                </div>`;
        })
        .catch(error => {
            output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        });
}


document.addEventListener('DOMContentLoaded', function() {
    detectIPDetails();
});

async function detectIPDetails() {
    const ipLoader = document.getElementById('ipLoader');
    const ipInfo = document.getElementById('ipInfo');
    
    try {

        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        

        const detailsResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
        const details = await detailsResponse.json();
        
        document.getElementById('currentIp').textContent = ipData.ip;
        document.getElementById('location').textContent = `${details.city}`;
        document.getElementById('country').textContent = `${details.country} (${details.countryCode})`;
        document.getElementById('region').textContent = details.regionName;
        document.getElementById('timezone').textContent = details.timezone;
        document.getElementById('isp').textContent = details.isp;

        initMap(details.lat, details.lon);


        ipLoader.style.display = 'none';
        ipInfo.style.display = 'block';

    } catch (error) {
        ipLoader.innerHTML = `
            <div class="error">
                <p>Error detecting IP details: ${error.message}</p>
                <button onclick="detectIPDetails()">Try Again</button>
            </div>
        `;
    }
}

function initMap(lat, lon) {

    const map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
}