let map = null; // Global variable for the map instance

// Initialize IP detection when page loads
document.addEventListener('DOMContentLoaded', function() {
    detectIPDetails();
});

// IP Detection and Details Function
async function detectIPDetails() {
    const ipLoader = document.getElementById('ipLoader');
    const ipInfo = document.getElementById('ipInfo');
    
    ipLoader.style.display = 'block';
    ipInfo.style.display = 'none';

    try {
        // Using a combination of secure APIs
        const response = await fetch('https://api.ipify.org?format=json');
        const ipData = await response.json();
        
        // Using secure endpoint for IP details
        const detailsResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const data = await detailsResponse.json();

        if (data.error) {
            throw new Error(data.reason || 'Failed to fetch IP details');
        }

        // Alternative API if ipapi.co fails
        if (!data.city) {
            const geoResponse = await fetch(`https://ipwho.is/${ipData.ip}`);
            const geoData = await geoResponse.json();
            
            if (geoData.success) {
                data.city = geoData.city;
                data.country_name = geoData.country;
                data.country_code = geoData.country_code;
                data.region = geoData.region;
                data.timezone = geoData.timezone.utc;
                data.org = geoData.connection.isp;
                data.latitude = geoData.latitude;
                data.longitude = geoData.longitude;
            }
        }

        // Update the UI
        document.getElementById('currentIp').textContent = ipData.ip;
        document.getElementById('location').textContent = data.city || 'N/A';
        document.getElementById('country').textContent = `${data.country_name} (${data.country_code})` || 'N/A';
        document.getElementById('region').textContent = data.region || 'N/A';
        document.getElementById('timezone').textContent = data.timezone || 'N/A';
        document.getElementById('isp').textContent = data.org || 'N/A';

        // Initialize map if coordinates are available
        if (data.latitude && data.longitude) {
            initMap(data.latitude, data.longitude);
        }

        // Hide loader and show info
        ipLoader.style.display = 'none';
        ipInfo.style.display = 'block';

    } catch (error) {
        // Fallback to another API if first attempt fails
        try {
            const fallbackResponse = await fetch('https://ipwho.is/');
            const fallbackData = await fallbackResponse.json();

            if (fallbackData.success) {
                document.getElementById('currentIp').textContent = fallbackData.ip;
                document.getElementById('location').textContent = fallbackData.city;
                document.getElementById('country').textContent = `${fallbackData.country} (${fallbackData.country_code})`;
                document.getElementById('region').textContent = fallbackData.region;
                document.getElementById('timezone').textContent = fallbackData.timezone.utc;
                document.getElementById('isp').textContent = fallbackData.connection.isp;

                initMap(fallbackData.latitude, fallbackData.longitude);

                ipLoader.style.display = 'none';
                ipInfo.style.display = 'block';
            } else {
                throw new Error('Fallback API failed');
            }
        } catch (fallbackError) {
            ipLoader.innerHTML = `
                <div class="error">
                    <p>Unable to detect IP details. Please try again later.</p>
                    <button onclick="refreshIPDetails()">Try Again</button>
                </div>
            `;
        }
    }
}

// Map initialization function
function initMap(lat, lon) {
    try {
        // If map container exists, destroy it and create new one
        const mapContainer = document.getElementById('map');
        if (map !== null) {
            map.remove();
        }

        // Create new map instance
        map = L.map('map').setView([lat, lon], 13);
        
        // Add tile layer (map style) using HTTPS
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            secure: true // Ensure HTTPS
        }).addTo(map);

        // Add marker
        L.marker([lat, lon]).addTo(map)
            .bindPopup('Your approximate location')
            .openPopup();

    } catch (error) {
        console.error('Map initialization failed:', error);
        document.getElementById('map').innerHTML = 'Map loading failed';
    }
}

// Refresh function
function refreshIPDetails() {
    const ipLoader = document.getElementById('ipLoader');
    ipLoader.innerHTML = `
        <div class="loading"></div>
        <p>Detecting your IP details...</p>
    `;
    detectIPDetails();
}

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
    const binary = document.getElementById('binaryInput'). value;
    const binaryParts = binary.split('.');
    let ip = '';

    for (let i = 0; i < 4; i++) {
        const byte = parseInt(binaryParts[i], 2);
        ip += byte;
        if (i < 3) {
            ip += '.';
        }
    }

    document.getElementById('ipOutput').innerHTML = `The IP equivalent is: ${ip}`;
}

// 6. IP to Binary Conversion
function convertIPToBinary() {
    const ip = document.getElementById('ipInput').value;
    const ipParts = ip.split('.');
    let binary = '';

    for (let i = 0; i < 4; i++) {
        const byte = parseInt(ipParts[i]).toString(2).padStart(8, '0');
        binary += byte;
        if (i < 3) {
            binary += '.';
        }
    }

    document.getElementById('binaryOutput').innerHTML = `The binary equivalent is: ${binary}`;
}

// 7. Subnet Mask to CIDR Conversion
function convertSubnetToCIDR() {
    const subnet = document.getElementById('subnetInput').value;
    const subnetParts = subnet.split('.');
    let cidr = 0;

    for (let part of subnetParts) {
        let binary = parseInt(part).toString(2);
        cidr += binary.split('1').length - 1;
    }

    document.getElementById('cidrOutput').innerHTML = `The CIDR equivalent is: /${cidr}`;
}

// 8. CIDR to Range Conversion
function convertCIDRToRange() {
    const cidrInput = document.getElementById('cidrInput').value;
    const [ip, prefix] = cidrInput.split('/');
    const prefixLength = parseInt(prefix);

    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        document.getElementById('rangeOutput').innerHTML = 'Invalid CIDR notation';
        return;
    }

    const ipParts = ip.split('.').map(part => parseInt(part));
    const binaryIP = ipParts.map(part => part.toString(2).padStart(8, '0')).join('');
    
    const netmask = '1'.repeat(prefixLength) + '0'.repeat(32 - prefixLength);
    const wildcard = '0'.repeat(prefixLength) + '1'.repeat(32 - prefixLength);

    const networkBinary = binaryIP.split('').map((bit, i) => bit & netmask[i]).join('');
    const broadcastBinary = binaryIP.split('').map((bit, i) => bit | wildcard[i]).join('');

    const networkIP = binaryToIP(networkBinary);
    const broadcastIP = binaryToIP(broadcastBinary);

    document.getElementById('rangeOutput').innerHTML = `Range: ${networkIP} - ${broadcastIP}`;
}

function binaryToIP(binary) {
    const octets = binary.match(/.{8}/g);
    return octets.map(octet => parseInt(octet, 2)).join('.');
}

// 9. Range to CIDR Conversion
function convertRangeToCIDR() {
    const range = document.getElementById('rangeInput').value;
    const [startIP, endIP] = range.split('-').map(ip => ip.trim());
    
    const start = ipToNumber(startIP);
    const end = ipToNumber(endIP);
    
    let prefix = 32;
    while (prefix > 0) {
        const mask = -1 << (32 - prefix);
        if ((start & mask) !== (end & mask)) {
            prefix--;
        } else {
            break;
        }
    }

    document.getElementById('cidrOutput2').innerHTML = `CIDR: ${startIP}/${prefix}`;
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

// 10. IPv6 Compress/Expand
function compressIPv6() {
    const ipv6 = document.getElementById('ipv6CompressInput').value;
    try {
        // Split into groups and remove leading zeros
        const groups = ipv6.split(':').map(g => {
            return g.replace(/^0+/, '') || '0';
        });

        // Find longest sequence of zeros
        let longestZeroStart = -1;
        let longestZeroLength = 0;
        let currentZeroStart = -1;
        let currentZeroLength = 0;

        for (let i = 0; i < groups.length; i++) {
            if (groups[i] === '0') {
                if (currentZeroStart === -1) currentZeroStart = i;
                currentZeroLength++;
                if (currentZeroLength > longestZeroLength) {
                    longestZeroStart = currentZeroStart;
                    longestZeroLength = currentZeroLength;
                }
            } else {
                currentZeroStart = -1;
                currentZeroLength = 0;
            }
        }

        // Replace longest zero sequence with ::
        if (longestZeroLength > 1) {
            groups.splice(longestZeroStart, longestZeroLength, '');
            if (longestZeroStart === 0) groups.unshift('');
            if (longestZeroStart + longestZeroLength === 8) groups.push('');
        }

        document.getElementById('ipv6CompressOutput').innerHTML = `Compressed IPv6: ${groups.join(':')}`;
    } catch (error) {
        document.getElementById('ipv6CompressOutput').innerHTML = 'Invalid IPv6 address';
    }
}

function expandIPv6() {
    const ipv6 = document.getElementById('ipv6CompressInput').value;
    try {
        // Handle ::
        let expanded = ipv6.replace('::', ':'.repeat(9 - ipv6.split(':').length));
        
        // Expand each group to 4 digits
        expanded = expanded.split(':').map(g => {
            return g.padStart(4, '0');
        }).join(':');

        document.getElementById('ipv6CompressOutput').innerHTML = `Expanded IPv6: ${expanded}`;
    } catch (error) {
        document.getElementById('ipv6CompressOutput').innerHTML = 'Invalid IPv6 address';
    }
}

// 11. Public vs. Private IP Check
function checkIPType() {
    const ip = document.getElementById('ipCheckInput').value;
    const ipParts = ip.split('.').map(part => parseInt(part));

    if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
        document.getElementById('ipCheckOutput').innerHTML = 'Invalid IP address';
        return;
    }

    if (
        (ipParts[0] === 10) || // 10.0.0.0/8
        (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) || // 172.16.0.0/12
        (ipParts[0] === 192 && ipParts[1] === 168) // 192.168.0.0/16
    ) {
        document.getElementById('ipCheckOutput').innerHTML = 'This is a Private IP address';
    } else if (
        (ipParts[0] === 127) || // Loopback
        (ipParts[0] === 169 && ipParts[1] === 254) // Link-local
    ) {
        document.getElementById('ipCheckOutput').innerHTML = 'This is a Special-use IP address';
    } else {
        document.getElementById('ipCheckOutput').innerHTML = 'This is a Public IP address';
    }
}

// ASN Lookup
async function lookupASN() {
    const ip = document.getElementById('asnInput').value;
    const asnOutput = document.getElementById('asnOutput');
    
    // Input validation
    if (!ip) {
        asnOutput.innerHTML = 'Please enter an IP address';
        return;
    }

    try {
        // Using ipapi.co for ASN lookup
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.reason || 'Failed to fetch ASN details');
        }

        // Format the output
        const asnInfo = `
            <div class="asn-details">
                <p><strong>ASN:</strong> ${data.asn || 'N/A'}</p>
                <p><strong>Organization:</strong> ${data.org || 'N/A'}</p>
                <p><strong>Network:</strong> ${data.network || 'N/A'}</p>
            </div>
        `;

        asnOutput.innerHTML = asnInfo;

    } catch (error) {
        // Fallback to alternative API
        try {
            const fallbackResponse = await fetch(`https://ipwho.is/${ip}`);
            const fallbackData = await fallbackResponse.json();

            if (fallbackData.success) {
                const asnInfo = `
                    <div class="asn-details">
                        <p><strong>ASN:</strong> ${fallbackData.connection.asn || 'N/A'}</p>
                        <p><strong>Organization:</strong> ${fallbackData.connection.org || 'N/A'}</p>
                        <p><strong>ISP:</strong> ${fallbackData.connection.isp || 'N/A'}</p>
                    </div>
                `;
                asnOutput.innerHTML = asnInfo;
            } else {
                throw new Error('Fallback API failed');
            }
        } catch (fallbackError) {
            asnOutput.innerHTML = `Error: Unable to fetch ASN information. Please try again later.`;
        }
    }
}

// Geolocation Lookup
async function lookupGeo() {
    const ip = document.getElementById('geoInput').value;
    const geoOutput = document.getElementById('geoOutput');

    // Input validation
    if (!ip) {
        geoOutput.innerHTML = 'Please enter an IP address';
        return;
    }

    try {
        // Using ipapi.co for geolocation
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.reason || 'Failed to fetch location details');
        }

        // Format the output
        const geoInfo = `
            <div class="geo-details">
                <p><strong>Country:</strong> ${data.country_name} (${data.country_code})</p>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>City:</strong> ${data.city}</p>
                <p><strong>Postal Code:</strong> ${data.postal || 'N/A'}</p>
                <p><strong>Latitude:</strong> ${data.latitude}</p>
                <p><strong>Longitude:</strong> ${data.longitude}</p>
                <p><strong>Timezone:</strong> ${data.timezone}</p>
            </div>
            <div id="geoMap" style="height: 300px; margin-top: 10px;"></div>
        `;

        geoOutput.innerHTML = geoInfo;

        // Initialize map for the location
        if (data.latitude && data.longitude) {
            const geoMap = L.map('geoMap').setView([data.latitude, data.longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(geoMap);
            L.marker([data.latitude, data.longitude]).addTo(geoMap)
                .bindPopup(`Location: ${data.city}, ${data.country_name}`)
                .openPopup();
        }

    } catch (error) {
        // Fallback to alternative API
        try {
            const fallbackResponse = await fetch(`https://ipwho.is/${ip}`);
            const fallbackData = await fallbackResponse.json();

            if (fallbackData.success) {
                const geoInfo = `
                    <div class="geo-details">
                        <p><strong>Country:</strong> ${fallbackData.country} (${fallbackData.country_code})</p>
                        <p><strong>Region:</strong> ${fallbackData.region}</p>
                        <p><strong>City:</strong> ${fallbackData.city}</p>
                        <p><strong>Postal Code:</strong> ${fallbackData.postal || 'N/A'}</p>
                        <p><strong>Latitude:</strong> ${fallbackData.latitude}</p>
                        <p><strong>Longitude:</strong> ${fallbackData.longitude}</p>
                        <p><strong>Timezone:</strong> ${fallbackData.timezone.utc}</p>
                    </div>
                    <div id="geoMap" style="height: 300px; margin-top: 10px;"></div>
                `;

                geoOutput.innerHTML = geoInfo;

                // Initialize map for the location
                if (fallbackData.latitude && fallbackData.longitude) {
                    const geoMap = L.map('geoMap').setView([fallbackData.latitude, fallbackData.longitude], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 18
                    }).addTo(geoMap);
                    L.marker([fallbackData.latitude, fallbackData.longitude]).addTo(geoMap)
                        .bindPopup(`Location: ${fallbackData.city}, ${fallbackData.country}`)
                        .openPopup();
                }
            } else {
                throw new Error('Fallback API failed');
            }
        } catch (fallbackError) {
            geoOutput.innerHTML = `Error: Unable to fetch location information. Please try again later.`;
        }
    }
}

// Add some CSS styles for the output
const style = document.createElement('style');
style.textContent = `
    .asn-details, .geo-details {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
    }

    .asn-details p, .geo-details p {
        margin: 5px 0;
    }

    .error {
        color: #dc3545;
        padding: 10px;
        border-radius: 5px;
        background: #ffe6e6;
    }
`;
document.head.appendChild(style);