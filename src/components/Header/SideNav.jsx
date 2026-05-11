import React from "react";
import { useNavigate } from "react-router";
import { logoutSession } from "../../services/adminFunctions";
import { notifyError, notifySuccess } from "../../utils/notify";
import Accordion from "../Accordion";

export default function SideNav({ close }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isAdminSession, setIsAdminSession] = React.useState(() =>
    Boolean(localStorage.getItem("adminId")),
  );
  const [hasSession, setHasSession] = React.useState(() =>
    Boolean(localStorage.getItem("userId") || localStorage.getItem("adminId")),
  );

  React.useEffect(() => {
    const syncSessionState = () => {
      setIsAdminSession(Boolean(localStorage.getItem("adminId")));
      setHasSession(
        Boolean(
          localStorage.getItem("userId") || localStorage.getItem("adminId"),
        ),
      );
    };

    window.addEventListener("storage", syncSessionState);
    return () => window.removeEventListener("storage", syncSessionState);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const response = await logoutSession();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to sign out");
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminEmail");
      setIsAdminSession(false);
      setHasSession(false);

      notifySuccess("Signed out successfully");
      close();
      navigate("/login", { replace: true });
    } catch (error) {
      notifyError(error.message || "Unable to sign out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-[85vh] flex flex-col justify-between gap-10 bg-white px-8 py-2">
      <div className="flex flex-col gap-6">
        {/* <Accordion title="Home" iconPosition=""></Accordion> */}
        <Accordion title="High Jewellery" iconPosition=""></Accordion>
        <Accordion title="Jewellery">
          <div className=" flex flex-col gap-3 px-4 pt-6 text-lg font-light font-serif ">
            <h3 className="hover:text-neutral-600 cursor-pointer">All</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">Bracelets</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">Rings</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">Necklace</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">Earrings</h3>
          </div>
        </Accordion>

        <Accordion title="Watches">
          <div className=" flex flex-col gap-3 px-4 pt-6 text-lg font-light font-serif ">
            <h3 className="hover:text-neutral-600 cursor-pointer">All</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">For Men</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">For Women</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Exceptional Watches
            </h3>
          </div>
        </Accordion>

        <Accordion title="Bags & Accessories">
          <div className=" flex flex-col gap-3 px-4 pt-6 text-lg font-light font-serif ">
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Men's Bags
            </h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Women's Bags
            </h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Accessories
            </h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Sunglasses
            </h3>
          </div>
        </Accordion>

        <Accordion title="Engagement & Bridal">
          <div className=" flex flex-col gap-3 px-4 pt-6 text-lg font-light font-serif ">
            <h3 className="hover:text-neutral-600 cursor-pointer">All</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Engagement Rings
            </h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">
              Wedding Bands
            </h3>
          </div>
        </Accordion>

        <Accordion title="Fragrance" iconPosition=""></Accordion>

        <Accordion title="Gifts">
          <div className=" flex flex-col gap-3 px-4 pt-6 text-lg font-light font-serif ">
            <h3 className="hover:text-neutral-600 cursor-pointer">For Him</h3>
            <h3 className="hover:text-neutral-600 cursor-pointer">For Her</h3>
          </div>
        </Accordion>
      </div>

      <div className="flex flex-col font-serif gap-4">
        <p className="text-xs uppercase tracking-[2px] text-neutral-600">
          Account
        </p>

        {isAdminSession && (
          <button
            type="button"
            className="text-sm font-light tracking-wider text-black hover:text-neutral-600 transition text-left"
            onClick={() => {
              close();
              navigate("/admin");
            }}
          >
            Admin Dashboard
          </button>
        )}

        {hasSession && (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="text-sm font-light tracking-wider text-black hover:text-neutral-600 transition text-left disabled:opacity-50"
          >
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        )}

        {!hasSession && (
          <>
            <button
              type="button"
              className="text-sm font-light tracking-wider text-black hover:text-neutral-600 transition text-left"
              onClick={() => {
                close();
                navigate("/login");
              }}
            >
              Login
            </button>

            <button
              type="button"
              className="text-sm font-light tracking-wider text-black hover:text-neutral-600 transition text-left"
              onClick={() => {
                close();
                navigate("/admin/login");
              }}
            >
              Admin Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
