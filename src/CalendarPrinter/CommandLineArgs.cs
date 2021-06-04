using System;
using System.Collections.Generic;
using System.Linq;

namespace CalendarPrinter
{
    internal class CommandLineArgs
    {
        private string[] _args;

        public CommandLineArgs(string[] args)
        {
            _args = args;
        }

        public int Count => _args.Length;

        private static readonly char[] switchPrefixes = new[] { '/', '-' };
        private static readonly char[] switchValueSeperators = new[] { ':', '=', ' ' };

        private IEnumerable<string> SwitchCombinations(params string[] switchName)
        {
            if (switchName.Length == 0)
                throw new ArgumentException($"{nameof(switchName)} must contain at least 1 item");

            foreach (var @switch in switchName)
            {
                foreach (var prefix in switchPrefixes)
                {
                    yield return prefix + @switch;
                }
            }
        }
        public bool HasSwitch(params string[] switchName)
        {
            if (switchName.Length == 0)
                throw new ArgumentException($"{nameof(switchName)} must contain at least 1 item");

            if (_args.Any(a => switchName.Any(s => a.Equals(s))))
                return true;

            if (_args.Any(a => SwitchCombinations(switchName).Any(s => a.Equals(s))))
                return true;

            return false;
        }

        public string this[string switchName]
        {
            get { return GetValue(switchName); }
        }

        private string GetValue(string switchName)
        {
            var combinations = SwitchCombinations(switchName).ToArray();

            for (int i = 0; i < _args.Length; i++)
            {
                string arg = _args[i];

                foreach (var combination in combinations)
                {
                    if (!arg.StartsWith(combination))
                        continue;

                    if(arg.Equals(combination))
                    {
                        if (i + 1 == _args.Length)
                            return null;
                        var value = _args[i + 1];

                        if (switchPrefixes.Any(prefix => value.StartsWith(prefix)))
                            return null;

                        return value;
                    }

                    var seperator = arg[combination.Length];
                    if (!switchValueSeperators.Any(sep => sep == seperator))
                        continue;

                    return arg.Substring(combination.Length + 1 /* Seperator length */);
                }
            }

            return null;
        }
    }
}