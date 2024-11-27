import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const SignInPage = () => {
    return (
        <div className="flex flex-col items-start max-w-sm mx-auto h-dvh pt-4 md:pt-20">
            <div className="flex items-center w-full py-8 border-b border-border/80">
                <Link href="/#home" className="flex items-center gap-x-2">
                    <h1 className="text-lg font-medium">
                        <Image src={'/assets/logo.png'} alt="Quick Rank Logo" width={200} height={200} />
                    </h1>
                </Link>
            </div>

            <SignIn />

        </div>
    )
};

export default SignInPage
