const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

const companySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    rfc: {
      type: String,
      trim: true,
      uppercase: true,
      match: [RFC_REGEX, "RFC inválido"],
    },
    logo_url: { type: String },
    website: { type: String },
    description: { type: String, maxlength: 500 },
    industry: {
      type: String,
      enum: [
        "Tecnología",
        "Fintech",
        "E-commerce",
        "Salud",
        "Educación",
        "Marketing",
        "Otro",
      ],
    },
    founded_year: { type: Number },
    employee_count: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "200+"],
    },
    verified: { type: Boolean, default: false },
    verified_at: { type: Date },
    verification_requested_at: { type: Date },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    password_hash: { type: String },
    role: {
      type: String,
      enum: ["freelancer", "recruiter", "admin"],
      required: true,
    },
    username: { type: String, required: true, unique: true },
    stellar_public_key: { type: String, unique: true, sparse: true },
    profile_image: { type: String, default: "" },
    bio: { type: String, default: "" },
    country: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    last_login: { type: Date, default: null },
    email_notifications: { type: Boolean, default: true },
    company: { type: companySchema, default: undefined },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

module.exports = mongoose.model("User", userSchema);
