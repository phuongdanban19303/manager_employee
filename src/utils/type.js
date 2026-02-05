/**
 * @typedef {Object} Certificate
 * @property {string} id
 * @property {string} name
 * @property {string} issuedDate
 * @property {string} content
 * @property {string} field
 */

/**
 * @typedef {Object} FamilyMember
 * @property {string} id
 * @property {string} fullName
 * @property {'Nam'|'Nữ'|'Khác'} gender
 * @property {string} dob
 * @property {string} idCard
 * @property {string} relationship
 * @property {string} address
 */

/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {'Nam'|'Nữ'|'Khác'} gender
 * @property {string} dob
 * @property {string} address
 * @property {string} team
 * @property {string=} avatar
 * @property {string} idCard
 * @property {string} phone
 * @property {string} email
 * @property {string} status
 * @property {Certificate[]} certificates
 * @property {FamilyMember[]} family
 */

/**
 * @typedef {Object} EmployeeState
 * @property {Employee[]} list
 * @property {boolean} loading
 * @property {string|null} error
 */