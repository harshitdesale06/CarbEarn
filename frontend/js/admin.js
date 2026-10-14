
const adminMessage = document.getElementById("adminMessage");

const totalUsersElement = document.getElementById("totalUsers");
const totalActivitiesElement = document.getElementById("totalActivities");
const totalCO2SavedElement = document.getElementById("totalCO2Saved");
const activeUsersElement = document.getElementById("activeUsers");

const usersTableBody = document.getElementById("usersTableBody");
const activitiesTableBody = document.getElementById("activitiesTableBody");

const userCountLabel = document.getElementById("userCountLabel");
const userTableFooter = document.getElementById("userTableFooter");

const userSearch = document.getElementById("userSearch");
const refreshAdminButton = document.getElementById("refreshAdmin");
const adminLogoutButton = document.getElementById("adminLogout");

const storedUser = localStorage.getItem("carbearn_user");
const token = localStorage.getItem("carbearn_token");

let allUsers = [];


// Check whether the browser has a logged-in admin.
function verifyAdminSession() {
    if (!storedUser || !token) {
        window.location.replace("login.html");
        return false;
    }

    try {
        const user = JSON.parse(storedUser);

        if (user.role !== "ADMIN") {
            window.location.replace("dashboard.html");
            return false;
        }

        return true;

    } catch (error) {
        localStorage.removeItem("carbearn_user");
        localStorage.removeItem("carbearn_token");

        window.location.replace("login.html");
        return false;
    }
}


// Display a status message.
function showAdminMessage(message, type = "error") {
    adminMessage.textContent = message;
    adminMessage.className = `admin-message ${type}`;
}


// Send an authenticated request to the backend.
async function adminFetch(endpoint) {
    const response = await fetch(
        `http://localhost:5000/api/admin/${endpoint}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("carbearn_user");
        localStorage.removeItem("carbearn_token");

        window.location.replace("login.html");

        throw new Error("Your session has expired. Please log in again.");
    }

    if (response.status === 403) {
        window.location.replace("dashboard.html");

        throw new Error("Administrator access is required.");
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load admin data."
        );
    }

    return data;
}


// Safely create table cells.
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "—";
    return cell;
}


// Format dates consistently.
function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// Load overview statistics.
async function loadAdminOverview() {
    const data = await adminFetch("overview");

    totalUsersElement.textContent =
        Number(data.totalUsers).toLocaleString("en-IN");

    totalActivitiesElement.textContent =
        Number(data.totalActivities).toLocaleString("en-IN");

    totalCO2SavedElement.textContent =
        `${Number(data.totalCO2Saved).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })} kg`;

    activeUsersElement.textContent =
        Number(data.activeUsers).toLocaleString("en-IN");
}


// Render the user table.
function renderUsers(users) {
    usersTableBody.replaceChildren();

    userCountLabel.textContent = `${users.length} shown`;

    userTableFooter.textContent =
        `Showing ${users.length} user${users.length === 1 ? "" : "s"}`;

    if (users.length === 0) {
        const row = document.createElement("tr");
        const cell = createCell("No matching users found.");

        cell.colSpan = 4;
        cell.className = "admin-empty-state";

        row.appendChild(cell);
        usersTableBody.appendChild(row);

        return;
    }

    users.forEach((user) => {
        const row = document.createElement("tr");

        const memberCell = document.createElement("td");
        const member = document.createElement("div");
        const avatar = document.createElement("div");
        const memberInfo = document.createElement("div");
        const name = document.createElement("strong");
        const email = document.createElement("span");

        member.className = "admin-member";
        avatar.className = "admin-member-avatar";
        memberInfo.className = "admin-member-info";

        const displayName = user.name || "Unnamed user";

        avatar.textContent = displayName
            .trim()
            .charAt(0)
            .toUpperCase() || "?";

        name.textContent = displayName;
        email.textContent = user.email || "No email";

        memberInfo.append(name, email);
        member.append(avatar, memberInfo);
        memberCell.appendChild(member);

        const collegeCell = createCell(user.college || "Not provided");

        const roleCell = document.createElement("td");
        const roleBadge = document.createElement("span");

        roleBadge.className =
            user.role === "ADMIN"
                ? "admin-role-badge admin-role-admin"
                : "admin-role-badge admin-role-user";

        roleBadge.textContent = user.role || "USER";
        roleCell.appendChild(roleBadge);

        const joinedCell = createCell(formatDate(user.created_at));

        row.append(
            memberCell,
            collegeCell,
            roleCell,
            joinedCell
        );

        usersTableBody.appendChild(row);
    });
}


// Load registered users.
async function loadAdminUsers() {
    allUsers = await adminFetch("users");
    renderUsers(allUsers);
}


// Render recent activities.
function renderActivities(activities) {
    activitiesTableBody.replaceChildren();

    if (activities.length === 0) {
        const row = document.createElement("tr");
        const cell = createCell("No activities have been recorded yet.");

        cell.colSpan = 7;
        cell.className = "admin-empty-state";

        row.appendChild(cell);
        activitiesTableBody.appendChild(row);

        return;
    }

    activities.forEach((activity) => {
        const row = document.createElement("tr");

        row.appendChild(
            createCell(activity.user_name || "Unknown user")
        );

        row.appendChild(
            createCell(activity.activity_name || "Unknown activity")
        );

        row.appendChild(
            createCell(
                `${Number(activity.quantity).toLocaleString("en-IN")} ${activity.unit || ""}`.trim()
            )
        );

        row.appendChild(
            createCell(
                `${Number(activity.co2_saved).toLocaleString("en-IN", {
                    maximumFractionDigits: 2
                })} kg`
            )
        );

        row.appendChild(
            createCell(activity.points)
        );

        const impactCell = document.createElement("td");
        const impactBadge = document.createElement("span");

        const impact = String(activity.impact || "Unknown").toLowerCase();

        impactBadge.className = "admin-impact-badge";

        if (["low", "medium", "high"].includes(impact)) {
            impactBadge.classList.add(`impact-${impact}`);
        }

        impactBadge.textContent =
            impact.charAt(0).toUpperCase() + impact.slice(1);

        impactCell.appendChild(impactBadge);
        row.appendChild(impactCell);

        row.appendChild(
            createCell(formatDate(activity.activity_date))
        );

        activitiesTableBody.appendChild(row);
    });
}


// Load the recent activity table.
async function loadAdminActivities() {
    const activities = await adminFetch("activities");
    renderActivities(activities);
}


// Refresh all sections.
async function refreshAdminData() {
    refreshAdminButton.disabled = true;
    refreshAdminButton.textContent = "Refreshing...";

    showAdminMessage("");

    const results = await Promise.allSettled([
        loadAdminOverview(),
        loadAdminUsers(),
        loadAdminActivities()
    ]);

    const failed = results.filter(
        (result) => result.status === "rejected"
    );

    refreshAdminButton.disabled = false;
    refreshAdminButton.textContent = "↻ Refresh data";

    if (failed.length > 0) {
        const message = failed
            .map((result) => result.reason?.message)
            .filter(Boolean)
            .join(" ");

        showAdminMessage(
            message || "Some admin data could not be loaded."
        );

        return;
    }

    showAdminMessage("Admin data updated successfully.", "success");
}


// Search users by name, email, college, or role.
userSearch.addEventListener("input", function () {
    const query = userSearch.value.trim().toLowerCase();

    const filteredUsers = allUsers.filter((user) => {
        return [
            user.name,
            user.email,
            user.college,
            user.role
        ].some((value) =>
            String(value || "").toLowerCase().includes(query)
        );
    });

    renderUsers(filteredUsers);
});


// Refresh button.
refreshAdminButton.addEventListener(
    "click",
    refreshAdminData
);


// Log out.
adminLogoutButton.addEventListener("click", function () {
    localStorage.removeItem("carbearn_user");
    localStorage.removeItem("carbearn_token");

    window.location.replace("login.html");
});


// Start only if the browser has an admin session.
if (verifyAdminSession()) {
    refreshAdminData();
}
