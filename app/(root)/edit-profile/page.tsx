"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, User, Mail, Phone, Camera } from "lucide-react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";

export default function EditProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  );
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await user?.update({ firstName: name.split(" ")[0], lastName: name.split(" ").slice(1).join(" ") });
      router.back();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 dark:hover:bg-general-700 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Edit Profile</h1>
      </div>

      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <Image
            src={user?.imageUrl || "/placeholder-user.svg"}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <InputField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-5 w-5" />}
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5" />}
        />
        <InputField
          label="Phone"
          placeholder="Add phone number"
          icon={<Phone className="h-5 w-5" />}
        />

        <div className="pt-4">
          <Button type="submit" loading={saving} className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
