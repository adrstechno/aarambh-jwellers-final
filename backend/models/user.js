import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // ✅ Email is optional; store as null instead of "" to prevent duplicate key errors
    email: {
  type: String,
  lowercase: true,
  trim: true,
  unique: true,
  sparse: true,
},
phone: {
  type: String,
  trim: true,
  unique: true,
  sparse: true,
},

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
<<<<<<< HEAD
      lowercase: true,
=======
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
<<<<<<< HEAD
      lowercase: true,
=======
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
    },

    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

/* =======================================================
   🔄 Normalize Case for Role & Status
======================================================= */
userSchema.pre("validate", function (next) {
  if (this.role) this.role = this.role.toLowerCase();
  if (this.status) this.status = this.status.toLowerCase();
  next();
});

/* =======================================================
   🔐 Ensure at least one of email or phone exists
======================================================= */
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("Either email or phone number must be provided"));
  }
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
