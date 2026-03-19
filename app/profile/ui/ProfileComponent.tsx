"use client"

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { useState, useRef } from "react"
import { useProcess } from "@/hooks/useProcess"
import { formatError } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CircleCheckIcon, OctagonXIcon, CameraIcon } from "lucide-react"


export default function ProfileComponent(
    { preUserData }: { preUserData: Preloaded<typeof api.users.getUser> }
) {
    const userData = usePreloadedQuery(preUserData)
    const patchUser = useMutation(api.users.updateUser)
    const updateAvatar = useMutation(api.users.updateAvatar)

    const [state, dispatch, clear] = useProcess()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")

    const submitter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!userData) {
            dispatch({ type: "fail", message: "User is not authenticated" })
            return
        }

        // // No changes but submits anyway
        if (!username && !bio) {
            clear()
            return
        }
        // Changes inputs but then switchs them back to preloaded form
        if (username === userData.username && bio === userData.bio) {
            clear()
            return
        }

        if (username.length < 2 || username.length > 20) {
            dispatch({
                type: "fail",
                message: "Username must be between 2 and 20 characters long."
            })
            setBio(userData?.bio ?? bio)
            return
        }

        if (bio.length < 1 || bio.length > 40) {
            dispatch({
                type: "fail",
                message: "Bio must be between 1 and 40 characters long."
            })
            setUsername(userData.username)
            return
        }

        try {

            dispatch({ type: "loading", message: null })
            await patchUser({ username, bio })
            dispatch({ type: "success", message: "Profile was updated." })
            setTimeout(() => clear(), 2500)

        } catch (error) {
            if (error instanceof Error && "data" in error) {
                dispatch({ type: "fail", message: formatError({ ...(error as any).data }) })
                return
            }

            dispatch({ type: "fail", message: "Something went wrong. Try again later" })
        }
    }

    const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e?.target?.files?.[0]
        if (!file) return

        try {
            dispatch({ type: "loading", message: null })
            const reader = new FileReader()
            reader.readAsDataURL(file)

            const postUrl = await fetchMutation(api.media.generateUploadUrl)

            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file
            })

            if (!result.ok) {
                dispatch({ type: "fail", message: "Failed to generate upload URL." })
                return
            }

            const { storageId: storageID } = await result.json()

            const url = await fetchMutation(api.media.getUploadUrl, { storageID })

            if (url) {
                await updateAvatar({ avatar: url })
                dispatch({ type: "success", message: "Avatar was updated." })
                setTimeout(() => clear(), 2000)
            }

        } catch (error) {
            if (error instanceof Error && "data" in error) {
                dispatch({ type: "fail", message: formatError({ ...(error as any).data }) })
                return
            }

            dispatch({ type: "fail", message: "Something went wrong. Try again later" })
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-4 md:py-8">
            <div className="w-full max-w-xl">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex h-6 w-6 items-center justify-center">
                                {state.loading && (
                                    <Spinner className="text-muted-foreground" />
                                )}
                                {state.success && !state.loading && (
                                    <CircleCheckIcon className="size-5 text-emerald-500" />
                                )}
                                {state.fail && !state.loading && (
                                    <OctagonXIcon className="size-5 text-destructive" />
                                )}
                            </div>
                            <p className="text-xs leading-tight text-muted-foreground">
                                {state.loading && "Updating..."}
                                {state.success && !state.loading && (
                                    <span className="text-emerald-600 dark:text-emerald-400">{state.success}</span>
                                )}
                                {state.fail && !state.loading && (
                                    <span className="text-destructive">{state.fail}</span>
                                )}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submitter} className="space-y-5">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    <Avatar className="size-20 md:size-24 border-4 border-border">
                                        <AvatarImage src={userData?.avatar} alt={username} />
                                        <AvatarFallback className="text-lg">{username?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={state.loading}
                                        className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Change avatar"
                                    >
                                        <CameraIcon className="size-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">Click the camera icon to change your avatar</p>
                            </div>

                            <input
                                ref={fileInputRef}
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarFile}
                                className="sr-only"
                            />

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        defaultValue={userData?.username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={state.loading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        2-20 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        type="text"
                                        placeholder="Tell us about yourself"
                                        defaultValue={userData?.bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        disabled={state.loading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Up to 40 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        value={userData?.email ?? ""}
                                        disabled
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-3">
                                <Button
                                    type="submit"
                                    disabled={state.loading}
                                    className="w-full md:w-auto"
                                >
                                    {state.loading ? (
                                        <>
                                            <Spinner className="mr-2 size-4" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}