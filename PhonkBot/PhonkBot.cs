using System;
using DSharpPlus;

namespace PhonkBot
{
    class PhonkBot
    {
        static void Main(String[] args)
        {
            MainAsync().GetAwaiter().GetResult();
        }

        static async Task MainAsync()
        {
            var discord = new DiscordClient(new DiscordConfiguration()
            {
                Token = "yes",
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.AllUnprivileged
            });
        }
    }
}