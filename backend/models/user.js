import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "customer"], // ✅ lowercase only
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "blocked"], // ✅ lowercase only
      default: "active",
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

/* =======================================================
   🔄 Normalize Case for Role & Status (Pre-Validation)
======================================================= */
userSchema.pre("validate", function (next) {
  if (this.role) this.role = this.role.toLowerCase();
  if (this.status) this.status = this.status.toLowerCase();
  next();
});

/* =======================================================
   🔐 Hash Password Before Save
======================================================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* =======================================================
   🔑 Compare Entered Password with Stored Hash
======================================================= */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
