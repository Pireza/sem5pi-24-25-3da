public class AuthenticationConstants
{
    public const string DOMAIN = "dev-b2f7avjyddz6kpot.us.auth0.com";
    public const string CLIENT_SECRET = "PWUXm2FRxt1SjxyH48sKHi1g9R2mjMZz-kuI_gSW0jOyOFBXzB64cYbKSLpyL5yX";
    public const string CLIENT_ID = "GP7EL4ZVrBhCjl4ZAaCw59ADreQnMsQr";
    public const string REDIRECTURI = "http://localhost:5000/callback";

    public const string REDIRECTURI2 = "http://localhost:5000/callback/";

    public const string ADMIN_ID = "rol_FWeFbdm8i6ItQhic";
    public const string DOCTOR_ID = "rol_FspOH0w3YtSmJsZu";
    public const string TECH_ID = "rol_4XOBau8jjUUud1Gv";
    public const string NURSE_ID = "rol_vOEO80y0HIUKAAQt";

   public static Dictionary<string, string> map = new Dictionary<string, string>
{
    { "Admin", ADMIN_ID },
    { "Doctor", DOCTOR_ID },
    { "Technician", TECH_ID },
    { "Nurse", NURSE_ID }
};

}